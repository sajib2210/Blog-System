import db from "../db/connectMysqlDB.js";
import { generatePostID } from "../utils/generatePostId.js";

export const sharePost = (req, res) => {
	// Extract `postID` and `description` from the request body
	const { postID, description } = req.body;

	// Extract `userId` from request (e.g., from a header or body, adjust accordingly)
	const userID = req.body.userId; // You might be sending `userId` in the body

	// Validate input
	if (!userID) {
		return res
			.status(400)
			.json({ error: "User ID is required to share a post." });
	}
	if (!postID || !description) {
		return res
			.status(400)
			.json({ error: "Post ID and description are required." });
	}

	// Generate a unique share ID
	const share_id = generatePostID();

	// SQL query to insert shared post into the database
	const insertQuery = `
    INSERT INTO shares (share_id, user_id, post_id, description)
    VALUES (?, ?, ?, ?)
  `;

	// Execute the SQL query
	db.query(
		insertQuery,
		[share_id, userID, postID, description],
		(err, result) => {
			if (err) {
				console.error("Error sharing post:", err.message);
				return res.status(500).json({ error: "Failed to share post" });
			}

			// Respond with success
			res.status(201).json({
				message: "Post shared successfully",
				shareId: share_id,
			});
		}
	);
};

export const getSharedPostsByUser = (req, res) => {
	// Extract `user_id` from request parameters
	const { user_id } = req.params;

	// Validate `user_id`
	if (!user_id) {
		return res
			.status(400)
			.json({ error: "User ID is required to fetch shared posts." });
	}

	// SQL query to get shared posts by user
	const query = `
    SELECT 
      shares.share_id,
      shares.description AS share_description,
      shares.shared_at,
      posts.postID,
      posts.title,
      posts.description AS post_description,
      posts.picture,
      posts.created_at AS post_created_at
    FROM 
      shares
    INNER JOIN 
      posts 
    ON 
      shares.post_id = posts.postID
    WHERE 
      shares.user_id = ?
    ORDER BY 
      shares.shared_at DESC
  `;

	// Execute the query to fetch shared posts
	db.query(query, [user_id], (err, results) => {
		if (err) {
			console.error("Error fetching shared posts:", err.message);
			return res.status(500).json({ error: "Failed to fetch shared posts" });
		}

		// Check if any shared posts exist
		if (results.length === 0) {
			return res
				.status(404)
				.json({ message: "No shared posts found for this user" });
		}

		// Return the shared posts
		res.status(200).json({
			message: "Shared posts retrieved successfully",
			sharedPosts: results,
		});
	});
};
