import db from "../db/connectMysqlDB.js";

const createSharesTable = () => {
	const query = `
    CREATE TABLE IF NOT EXISTS shares (
        share_id VARCHAR(16) PRIMARY KEY,
        user_id VARCHAR(255) NOT NULL, 
        post_id VARCHAR(16) NOT NULL, 
        description TEXT, 
        shared_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
        FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE, 
        FOREIGN KEY (post_id) REFERENCES posts(postID) ON DELETE CASCADE 
    )
  `;

	db.query(query, (err, result) => {
		if (err) {
			console.error("Error creating Shares table:", err.message);
		} else {
			console.log("Shares table created successfully.");
		}
	});
};

createSharesTable();

export default createSharesTable;
