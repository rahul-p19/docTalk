import express from "express";
import protectRoute from "../middlewares/protectRoute.js";
import { getMessages, getUsersForSidebar, sendMessage } from "../controllers/messagesController.js";
const router = express.Router();

router.get("/conversations", protectRoute, getUsersForSidebar);
router.get("/:id", protectRoute, getMessages);
router.post("/send/:id", protectRoute, sendMessage);

export default router;