"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const protectRoute_js_1 = __importDefault(require("../middlewares/protectRoute.js"));
const messagesController_js_1 = require("../controllers/messagesController.js");
const router = express_1.default.Router();
router.get("/conversations", protectRoute_js_1.default, messagesController_js_1.getUsersForSidebar);
router.get("/:id", protectRoute_js_1.default, messagesController_js_1.getMessages);
router.post("/send/:id", protectRoute_js_1.default, messagesController_js_1.sendMessage);
exports.default = router;
