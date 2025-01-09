import express from "express";
//import dotenv from "dotenv";
//import cookieParser from "cookie-parser";
import cors from "cors";

import db from "./db/connectMysqlDB.js";

//routes
import authroutes from "./routes/auth.routes.js";
import postroutes from "./routes/post.routes.js";
import boostedroutes from "./routes/boosted.routes.js";
import commentroutes from "./routes/comment.route.js";
import shareroutes from "./routes/share.routes.js";
import followroutes from "./routes/follow.routes.js";
import userroutes from "./routes/user.routes.js";
//import filterroutes from "./routes/filter.routes.js";

//tables
// import createUsersTable from "./models/user.model.js";
// import createPostsTable from "./models/post.model.js";
//import createBoostedPostsTable from "./models/boosted.post.model.js";
// import createCommentsTable from "./models/comment.model.js";
// import createSharesTable from "./models/share.model.js";
// import createFollowingTable from "./models/following.model.js";

// createFollowingTable();

// createSharesTable();

// createCommentsTable();

//createBoostedPostsTable();

// createPostsTable();

// createUsersTable();

//dotenv.config();
//app.use(cookieParser());

const app = express();

app.use(express.json());
app.use(
	cors({
		origin: "http://localhost:5173", // Frontend URL
		credentials: true, // Allow cookies and other credentials
	})
);

app.get("/", (req, res) => {
	res.send("server is running");
});

app.use("/api/auth", authroutes);
app.use("/api/posts", postroutes);
app.use("/api/boosted", boostedroutes);
app.use("/api/comments", commentroutes);
app.use("/api/shares", shareroutes);
app.use("/api/following", followroutes);
app.use("/api/users", userroutes);

const PORT = 5000;

app.listen(PORT, () => {
	console.log(`Server is running on http://localhost:${PORT}`);

	// Test the database connection
	db.connect((err) => {
		if (err) {
			console.error("Error connecting to the database:", err.message);
		} else {
			console.log("Connected to the database successfully!");
		}
	});
});
