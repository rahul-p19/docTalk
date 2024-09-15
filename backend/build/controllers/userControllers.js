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
exports.getMe = exports.logout = exports.login = exports.signup = void 0;
const prisma_js_1 = __importDefault(require("../db/prisma.js"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const generateToken_js_1 = __importDefault(require("../utils/generateToken.js"));
const signup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, fullName, email, password, confirmPassword, gender, role } = req.body;
        if (!fullName || !username || !password || !confirmPassword || !gender) {
            return res.status(400).json({ error: "Please fill in all fields" });
        }
        if (password !== confirmPassword) {
            return res.status(400).json({ error: "Passwords don't match" });
        }
        const user = yield prisma_js_1.default.user.findUnique({ where: { email } });
        if (user) {
            return res.status(400).json({ error: "Username already exists" });
        }
        const salt = yield bcryptjs_1.default.genSalt(10);
        const hashedPassword = yield bcryptjs_1.default.hash(password, salt);
        const patientMaleProfilePic = `https://avatar.iran.liara.run/public/boy?username=${username}`;
        const patientFemaleProfilePic = `https://avatar.iran.liara.run/public/girl?username=${username}`;
        const doctorMaleProfilePic = "https://avatar.iran.liara.run/public/job/doctor/male";
        const doctorFemaleProfilePic = "https://avatar.iran.liara.run/public/job/doctor/female";
        const newUser = yield prisma_js_1.default.user.create({
            data: {
                fullName: role === "doctor" ? `Dr. ${fullName}` : fullName,
                username,
                email,
                password: hashedPassword,
                gender,
                role,
                profilePic: role === "doctor" ? gender === "male" ? doctorMaleProfilePic : doctorFemaleProfilePic : gender === "male" ? patientMaleProfilePic : patientFemaleProfilePic,
            },
        });
        if (newUser) {
            (0, generateToken_js_1.default)(newUser.id, res);
            res.status(201).json({
                id: newUser.id,
                fullName: newUser.fullName,
                username: newUser.username,
                profilePic: newUser.profilePic,
                email: newUser.email,
                role: newUser.role
            });
        }
        else {
            res.status(400).json({ error: "Invalid user data" });
        }
    }
    catch (error) {
        console.log("Error in signup controller", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
exports.signup = signup;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const user = yield prisma_js_1.default.user.findUnique({ where: { email } });
        if (!user) {
            return res.status(400).json({ error: "Invalid credentials" });
        }
        const isPasswordCorrect = yield bcryptjs_1.default.compare(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(400).json({ error: "Invalid credentials" });
        }
        (0, generateToken_js_1.default)(user.id, res);
        res.status(200).json({
            id: user.id,
            fullName: user.fullName,
            username: user.username,
            profilePic: user.profilePic,
            email: user.email,
            role: user.role
        });
    }
    catch (error) {
        console.log("Error in login controller", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
exports.login = login;
const logout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res.cookie("jwt", "", { maxAge: 0 });
        res.status(200).json({ message: "Logged out successfully" });
    }
    catch (error) {
        console.log("Error in logout controller", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
exports.logout = logout;
const getMe = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield prisma_js_1.default.user.findUnique({ where: { id: req.user.id } });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        res.status(200).json({
            id: user.id,
            fullName: user.fullName,
            username: user.username,
            profilePic: user.profilePic,
            email: user.email,
            role: user.role
        });
    }
    catch (error) {
        console.log("Error in getMe controller", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
exports.getMe = getMe;
