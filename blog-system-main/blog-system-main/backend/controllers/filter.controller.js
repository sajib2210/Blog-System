import db from "../db/connectMysqlDB.js";

export const filterPostsByTime = (req, res) => {
	const { sort } = req.query;

	const order = sort === "asc" ? "ASC" : "DESC";

	const query = `SELECT * FROM posts ORDER BY created_at ${order}`;

	db.query(query, (err, results) => {
		if (err) {
			console.error("Error filtering posts by time:", err.message);
			return res.status(500).json({ error: "Failed to filter posts by time." });
		}

		res.status(200).json(results); // Return the filtered posts
	});
};
