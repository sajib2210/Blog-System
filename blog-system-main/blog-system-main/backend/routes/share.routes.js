import express from "express";
//import { protectRoute } from "../utils/protectRoute.js";

import {
	sharePost,
	getSharedPostsByUser,
} from "../controllers/share.controller.js";

const router = express.Router();

router.post("/", sharePost);
router.get("/:user_id", getSharedPostsByUser);

export default router;
