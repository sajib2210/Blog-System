import express from "express";
//import { protectRoute } from "../utils/protectRoute.js";

import {
	followUser,
	unfollowUser,
	getFollowings,
} from "../controllers/following.controller.js";

const router = express.Router();

router.post("/follow/:following_user_id", followUser);
router.post("/unfollow/:following_user_id", unfollowUser);
router.get("/:userId", getFollowings);
export default router;
