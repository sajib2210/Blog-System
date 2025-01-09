import express from "express";
import {
	signup,
	login,
	logout,
	getAllUsers,
} from "../controllers/auth.controller.js";
//import { protectRoute } from "../utils/protectRoute.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);

router.get("/users", getAllUsers);

export default router;
