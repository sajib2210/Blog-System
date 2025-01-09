import db from "../db/connectMysqlDB.js";

// Get Current User Controller
export const getCurrentUser = (req, res) => {
	const { userID } = req.params;

	const query = "SELECT user_id, username, email FROM users WHERE user_id = ?";
	db.query(query, [userID], (err, results) => {
		if (err) {
			console.error("Error fetching user data:", err.message);
			return res.status(500).json({ error: "Internal server error" });
		}

		if (results.length === 0) {
			return res.status(404).json({ error: "User not found" });
		}

		const user = results[0];

		res.status(200).json({
			userId: user.user_id,
			username: user.username,
			email: user.email,
		});
	});
};
