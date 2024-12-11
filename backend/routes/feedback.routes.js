import express from "express";
import { protectRoute } from "../middleware/protectRoutes.js";
import { addFeed } from "../controllers/feedback.controller.js";

const router = express.Router();
router.post("/",protectRoute,addFeed);

export default router;