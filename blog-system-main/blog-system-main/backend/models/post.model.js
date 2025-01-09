import db from "../db/connectMysqlDB.js";

const createPostsTable = () => {
	const query = `
    CREATE TABLE IF NOT EXISTS posts (
        postID VARCHAR(16) PRIMARY KEY,
        userID VARCHAR(255) NOT NULL, 
        title VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        picture VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (userID) REFERENCES users(user_id) ON DELETE CASCADE -- Maintain relationship
    )
  `;

	db.query(query, (err, result) => {
		if (err) {
			console.error("Error creating Posts table:", err.message);
		} else {
			console.log("Posts table created successfully.");
		}
	});
};

createPostsTable();

export default createPostsTable;
