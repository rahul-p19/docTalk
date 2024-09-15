"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const protectRoute_1 = __importDefault(require("../middlewares/protectRoute"));
const checkRole_1 = __importDefault(require("../middlewares/checkRole"));
const Roles_js_1 = require("../utils/Roles.js");
const doctorauthContorller_js_1 = require("../controllers/doctorauthContorller.js");
const router = express_1.default.Router();
router.get('/register', protectRoute_1.default, (0, checkRole_1.default)(Roles_js_1.Role.doctor), doctorauthContorller_js_1.doctorregistration);
exports.default = router;
