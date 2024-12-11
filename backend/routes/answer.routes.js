import express from "express";
import { getCorrectAnswer, getResult, getResultList, isSubmitted, submitTest, updateAnswer } from "../controllers/answer.controller.js";
import { protectRoute } from "../middleware/protectRoutes.js";

const router = express.Router();
router.post("/submitted/:test_id",protectRoute,isSubmitted);
router.put("/response/:test_id",protectRoute,updateAnswer);
router.post("/submit/:test_id",protectRoute,submitTest);
router.get("/result/:test_id",protectRoute,getResult);
router.get("/result",protectRoute,getResultList);
router.get("/result/getAnswers/:test_id",protectRoute,getCorrectAnswer);

export default router;