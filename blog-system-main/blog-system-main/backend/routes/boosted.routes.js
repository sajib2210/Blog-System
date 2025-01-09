import express from "express";

import {
	boostPost,
	getBoostedPosts,
} from "../controllers/boosted.controller.js";

const router = express.Router();

router.post("/", boostPost);
router.get("/", getBoostedPosts);

export default router;
