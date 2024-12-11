import express from "express"
import { getParticularTest, getQuestions, getTests } from "../controllers/test.controller.js";
import { protectRoute } from "../middleware/protectRoutes.js";

const router = express.Router();

router.get("/alltests",protectRoute,getTests);
router.get("/:id",protectRoute,getParticularTest);
router.get("/questions/:id",protectRoute,getQuestions);

export default router;