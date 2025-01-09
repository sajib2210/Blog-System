import db from "../db/connectMysqlDB.js";
import { generatePostID } from "../utils/generatePostId.js";

export const createPost = (req, res) => {
	const { title, description, picture, userId } = req.body; // Accept userId from the request body

	// If the userId is not present in the request, return an error
	if (!userId) {
		return res
			.status(400)
			.json({ error: "User ID is required to create a post" });
	}

	const postID = generatePostID();

	const insertQuery = `INSERT INTO posts (postID, userID, title, description, picture) VALUES (?, ?, ?, ?, ?)`;

	db.query(
		insertQuery,
		[postID, userId, title, description, picture],
		(err, result) => {
			if (err) {
				console.error("Error creating post:", err.message);
				return res.status(500).json({ error: "Failed to create post" });
			}

			res.status(201).json({
				message: "Post created successfully",
				postID: postID, // Return the generated postID to the client
				userID: userId,
			});
		}
	);
};

export const getPost = (req, res) => {
	const selectQuery = "SELECT * FROM posts";

	db.query(selectQuery, (err, results) => {
		if (err) {
			console.error("Error fetching posts:", err.message);
			return res.status(500).json({ error: "Failed to fetch posts" });
		}

		res.status(200).json(results);
	});
};

export const getUserPosts = (req, res) => {
	const { userID } = req.params;

	const selectQuery = "SELECT * FROM posts WHERE userID = ?";

	db.query(selectQuery, [userID], (err, results) => {
		if (err) {
			console.error("Error fetching posts:", err.message);
			return res.status(500).json({ error: "Failed to fetch posts" });
		}

		if (results.length === 0) {
			return res.status(404).json({ error: "No posts found for this user" });
		}

		res.status(200).json(results);
	});
};

export const updatePost = (req, res) => {
	const { postID } = req.params;
	const { title, description, picture } = req.body;

	const updateQuery = `UPDATE posts SET title = ?, description = ?, picture = ? WHERE postID = ?`;

	db.query(
		updateQuery,
		[title, description, picture, postID],
		(err, result) => {
			if (err) {
				console.error("Error updating post:", err.message);
				return res.status(500).json({ error: "Failed to update post" });
			}

			if (result.affectedRows === 0) {
				return res.status(404).json({ error: "Post not found" });
			}

			res.status(200).json({ message: "Post updated successfully" });
		}
	);
};

export const deletePost = (req, res) => {
	const { postID } = req.params;

	const deleteQuery = "DELETE FROM posts WHERE postID = ?";

	db.query(deleteQuery, [postID], (err, result) => {
		if (err) {
			console.error("Error deleting post:", err.message);
			return res.status(500).json({ error: "Failed to delete post" });
		}

		if (result.affectedRows === 0) {
			return res.status(404).json({ error: "Post not found" });
		}

		res.status(200).json({ message: "Post deleted successfully" });
	});
};
