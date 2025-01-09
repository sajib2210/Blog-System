import db from "../db/connectMysqlDB.js";

const createCommentsTable = () => {
	const query = `
    CREATE TABLE IF NOT EXISTS comments (
    comment_id VARCHAR(20) PRIMARY KEY, 
    user_id VARCHAR(255) NOT NULL,             
    post_id VARCHAR(16) NOT NULL,              
    comment_text TEXT NOT NULL,                
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE, 
    FOREIGN KEY (post_id) REFERENCES posts(postID) ON DELETE CASCADE   
    )
  `;

	db.query(query, (err, result) => {
		if (err) {
			console.error("Error creating Comments table:", err.message);
		} else {
			console.log("Comments table created successfully.");
		}
	});
};

createCommentsTable();

export default createCommentsTable;
