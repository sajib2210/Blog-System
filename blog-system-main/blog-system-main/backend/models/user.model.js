import db from "../db/connectMysqlDB.js";

const createUsersTable = () => {
	const query = `
    CREATE TABLE IF NOT EXISTS users (
        phone_no VARCHAR(255),
        user_id VARCHAR(255) PRIMARY KEY,
        username VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE ,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        usertype VARCHAR(255) DEFAULT 'user',
        userposts INT DEFAULT 0
    )
  `;

	db.query(query, (err, result) => {
		if (err) {
			console.error("Error creating Users table:", err.message);
		} else {
			console.log("Users table created successfully.");
		}
	});
};

createUsersTable();

export default createUsersTable;
