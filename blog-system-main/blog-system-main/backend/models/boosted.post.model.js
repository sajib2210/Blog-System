import db from "../db/connectMysqlDB.js";

const createBoostedPostsTable = () => {
	const query = `
    CREATE TABLE IF NOT EXISTS boosted_posts (
    postID VARCHAR(16) NOT NULL,
    duration INT NOT NULL,
    boosted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (postID) REFERENCES posts(postID) ON DELETE CASCADE)`;

	db.query(query, (err, result) => {
		if (err) {
			console.error("Error creating Boosted Posts table:", err.message);
		} else {
			console.log("Boosted Posts table created successfully.");
		}
	});
};

createBoostedPostsTable();

export default createBoostedPostsTable;
