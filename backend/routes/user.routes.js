import express from "express"
import { protectRoute } from "../middleware/protectRoutes.js";
import { changePassword, updateDetails, updateImage, user, getDetail } from "../controllers/user.controllers.js";

const router = express.Router();

router.put("/update/image",protectRoute,updateImage);
router.post("/update/details",protectRoute,updateDetails);
router.post("/update/password",protectRoute,changePassword);
router.get("/",protectRoute,user);
router.get("/:userId",protectRoute,getDetail);

export default router;