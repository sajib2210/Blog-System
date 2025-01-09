import db from "../db/connectMysqlDB.js";
import { generatePostID } from "../utils/generatePostId.js";

export const createComment = (req, res) => {
	const { postID } = req.params;
	const { comment, userId } = req.body; // Get userId from the request body, just like we did for posts

	// Check if userId is missing in the request
	if (!userId) {
		return res
			.status(400)
			.json({ error: "User ID is required to create a comment" });
	}

	const commentID = generatePostID();

	const insertQuery = `INSERT INTO comments (comment_id, user_id, post_id, comment_text) VALUES (?, ?, ?, ?)`;

	db.query(insertQuery, [commentID, userId, postID, comment], (err, result) => {
		if (err) {
			console.error("Error creating comment:", err.message);
			return res.status(500).json({ error: "Failed to create comment" });
		}

		res.status(201).json({
			message: "Comment created successfully",
			commentID: commentID, // Return the generated commentID to the client
			comment: comment,
		});
	});
};

export const getComments = (req, res) => {
	const { postID } = req.params; // Use postID from the request parameters

	const selectQuery = "SELECT * FROM comments WHERE post_id = ?";

	db.query(selectQuery, [postID], (err, results) => {
		if (err) {
			console.error("Error fetching comments:", err.message);
			return res.status(500).json({ error: "Failed to fetch comments" });
		}

		if (results.length === 0) {
			return res.status(404).json({ error: "No comments found for this post" });
		}

		res.status(200).json(results); // Return all comments for the post
	});
};

export const deleteComment = (req, res) => {
	const { commentId } = req.params;

	const deleteQuery = "DELETE FROM comments WHERE comment_id = ?";

	db.query(deleteQuery, [commentId], (err, result) => {
		if (err) {
			console.error("Error deleting comment:", err.message);
			return res.status(500).json({ error: "Failed to delete comment" });
		}

		if (result.affectedRows === 0) {
			return res.status(404).json({ error: "Comment not found" });
		}

		res.status(200).json({ message: "Comment deleted successfully" });
	});
};
