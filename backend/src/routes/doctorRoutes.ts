import express from "express";
import protectRoute from "../middlewares/protectRoute"
import checkRole from "../middlewares/checkRole"
import { Role } from "../utils/Roles.js"
import { doctorregistration } from "../controllers/doctorauthContorller.js";

const router = express.Router();

router.get('/register', protectRoute, checkRole(Role.doctor), doctorregistration)

export default router;