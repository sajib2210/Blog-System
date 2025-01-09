import db from "../db/connectMysqlDB.js";

const createFollowingTable = () => {
	const query = `
    CREATE TABLE IF NOT EXISTS following (
        user_id VARCHAR(255) NOT NULL,
        following_user_id VARCHAR(255) NOT NULL,
        followed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (user_id, following_user_id),
        FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
        FOREIGN KEY (following_user_id) REFERENCES users(user_id) ON DELETE CASCADE
    )
  `;

	db.query(query, (err, result) => {
		if (err) {
			console.error("Error creating Following table:", err.message);
		} else {
			console.log("Following table created successfully.");
		}
	});
};

createFollowingTable();

export default createFollowingTable;
