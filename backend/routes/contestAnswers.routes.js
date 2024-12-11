import express from "express"
import { protectRoute } from "../middleware/protectRoutes.js";
import { getCorrectAnswer, getResult, getUserRank, isSubmitted, submitTest, updateAnswer } from "../controllers/contestAnswers.controller.js";

const router = express.Router();
router.post("/submitted/:contestId",protectRoute,isSubmitted);
router.put("/response/:contestId",protectRoute,updateAnswer);
router.post("/submit/:contestId",protectRoute,submitTest);
router.get("/result/:contestId",protectRoute,getResult);
router.get("/result/getAnswers/:contestId",protectRoute,getCorrectAnswer);
router.get("/rank/:contestId",protectRoute,getUserRank)

export default router;