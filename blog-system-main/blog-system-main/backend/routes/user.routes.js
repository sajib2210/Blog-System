import express from "express";

import { getCurrentUser } from "../controllers/user.controller.js";

const router = express.Router();

router.get("/:userID", getCurrentUser);

export default router;
