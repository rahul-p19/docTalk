"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.doctorregistration = void 0;
const prisma_js_1 = __importDefault(require("../db/prisma.js"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const doctorregistration = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, licenseNo, specialization, practiceAddress, YoE, password } = req.body;
        const user = yield prisma_js_1.default.user.findUnique({ where: { email } });
        if (!user) {
            return res.status(400).json({ error: "User Not Found" });
        }
        const isPasswordCorrect = yield bcryptjs_1.default.compare(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(400).json({ error: "Invalid credentials" });
        }
        const newDoctor = yield prisma_js_1.default.doctorDetails.create({
            data: {
                doctorId: user.id,
                licenseNo,
                specialization,
                practiceAddress,
                YoE,
            },
        });
        res.status(201).json({
            id: newDoctor.doctorId,
            licenseNo,
            specialization,
            practiceAddress,
            YoE
        });
    }
    catch (error) {
        console.log("Error in doctorauth controller", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
exports.doctorregistration = doctorregistration;
