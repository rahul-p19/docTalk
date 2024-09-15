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
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkToken = void 0;
const jwt = require("jsonwebtoken");
const checkToken = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const decoded = jwt.verify(req.headers.authorization, process.env.JWTSECRET);
        req.userId = decoded.userName;
        next();
    }
    catch (err) {
        res.status(404);
        res.send({
            msg: "accessDenied"
        });
    }
});
exports.checkToken = checkToken;
