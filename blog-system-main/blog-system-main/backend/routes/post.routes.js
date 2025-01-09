import express from "express";
//import { protectRoute } from "../utils/protectRoute.js";
import { filterPostsByTime } from "../controllers/filter.controller.js";

import {
	createPost,
	getPost,
	updatePost,
	deletePost,
	getUserPosts,
} from "../controllers/post.controller.js";

const router = express.Router();

router.post("/", createPost);
router.get("/", (req, res) => {
	const { sort } = req.query;

	if (sort) {
		return filterPostsByTime(req, res); // Handle filtering logic
	}

	return getPost(req, res); // Handle regular fetching
});
router.get("/:userID", getUserPosts);
router.put("/:postID", updatePost);
router.delete("/:postID", deletePost);

export default router;
