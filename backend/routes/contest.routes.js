import express from "express";
import { protectRoute } from "../middleware/protectRoutes.js";
import { getFeatured, getMyContests, getParticularContest, getPastContests, getQuestions, getUpcoming, register } from "../controllers/contest.controller.js";

const router = express.Router();

router.get("/upcoming",protectRoute,getUpcoming);
router.get("/featured",protectRoute,getFeatured);
router.get("/past",protectRoute,getPastContests);
router.get("/my",protectRoute,getMyContests);
router.post("/register/:contestId",protectRoute,register);
router.get("/:contestId",protectRoute,getParticularContest);
router.get("/questions/:contestId",protectRoute,getQuestions);

export default router;