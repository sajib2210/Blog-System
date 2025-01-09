import db from "../db/connectMysqlDB.js";

export const followUser = (req, res) => {
	const { following_user_id } = req.params;
	const { userId } = req.body; // Expect userId to be passed in the body

	// If userId is not provided, return an error
	if (!userId) {
		return res.status(400).json({ error: "User ID is required to follow." });
	}

	// If user is trying to follow themselves, return an error
	if (userId === following_user_id) {
		return res.status(400).json({ error: "You cannot follow yourself." });
	}

	// Ensure no duplicates by using REPLACE or INSERT IGNORE
	const query = `
    INSERT INTO following (user_id, following_user_id) VALUES (?, ?)
    ON DUPLICATE KEY UPDATE user_id = user_id
  `;

	db.query(query, [userId, following_user_id], (err, result) => {
		if (err) {
			console.error("Error following user:", err.message);
			return res.status(500).json({ error: "Failed to follow user" });
		}

		res.status(201).json({ message: "User followed successfully" });
	});
};

export const unfollowUser = (req, res) => {
	const { following_user_id } = req.params;
	const { userId } = req.body; // Expect userId to be passed in the body

	// If userId is not provided, return an error
	if (!userId) {
		return res.status(400).json({ error: "User ID is required to unfollow." });
	}

	const query = `
    DELETE FROM following WHERE user_id = ? AND following_user_id = ?
  `;

	db.query(query, [userId, following_user_id], (err, result) => {
		if (err) {
			console.error("Error unfollowing user:", err.message);
			return res.status(500).json({ error: "Failed to unfollow user" });
		}

		if (result.affectedRows === 0) {
			return res
				.status(404)
				.json({ error: "Following relationship not found" });
		}

		res.status(200).json({ message: "User unfollowed successfully" });
	});
};

export const getFollowings = (req, res) => {
	const { userId } = req.params;

	if (!userId) {
		return res
			.status(400)
			.json({ error: "User ID is required to get followings." });
	}

	const query = `
    SELECT 
        users.user_id, users.username, users.email 
    FROM 
        following
    INNER JOIN 
        users 
    ON 
        following.following_user_id = users.user_id
    WHERE 
        following.user_id = ?
  `;

	db.query(query, [userId], (err, results) => {
		if (err) {
			console.error("Error fetching followings:", err.message);
			return res.status(500).json({ error: "Failed to fetch followings." });
		}

		res.status(200).json({
			message: "Followings retrieved successfully.",
			followings: results,
		});
	});
};
