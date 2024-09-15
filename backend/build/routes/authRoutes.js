"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userControllers_js_1 = require("../controllers/userControllers.js");
const protectRoute_js_1 = __importDefault(require("../middlewares/protectRoute.js"));
const router = express_1.default.Router();
router.get("/me", protectRoute_js_1.default, userControllers_js_1.getMe);
router.post("/signup", userControllers_js_1.signup);
router.post("/login", userControllers_js_1.login);
router.post("/logout", userControllers_js_1.logout);
exports.default = router;
