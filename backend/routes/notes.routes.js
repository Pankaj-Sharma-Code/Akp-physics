import express from "express"
import { protectRoute } from "../middleware/protectRoutes.js";
import { getSecrets } from "../controllers/notes.controller.js";

const router = express.Router();

router.get("/secrets",protectRoute,getSecrets);

export default router;