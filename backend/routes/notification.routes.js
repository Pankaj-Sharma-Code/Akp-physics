import express from "express"
import { protectRoute } from "../middleware/protectRoutes.js";
import { countNotification, getNotification } from "../controllers/notification.controller.js";

const router = express.Router();

router.get("/",protectRoute,getNotification);
router.get("/count",protectRoute,countNotification);

export default router;