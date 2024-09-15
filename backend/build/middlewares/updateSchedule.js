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
const client_js_1 = __importDefault(require("../client.js"));
const date_fns_1 = require("date-fns");
const medControllers_js_1 = require("../controllers/medControllers.js");
const rrule_1 = require("rrule");
function updateSchedules(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const allMeds = yield client_js_1.default.medicine.findMany({
                where: {
                    userId: req.user.id,
                },
            });
            allMeds.map((med) => {
                const updatedNextOcc = (0, date_fns_1.closestTo)(new Date(), rrule_1.RRule.fromString(med.rrule).all().filter(date_fns_1.isFuture));
                if (!updatedNextOcc)
                    med.nextOcc = new Date(0);
                else
                    med.nextOcc = updatedNextOcc;
                (0, medControllers_js_1.scheduleNotif)(med.nextOcc, med.medId, med.rrule);
            });
            next();
        }
        catch (err) {
            res.status(500).json({ msg: "Error in updating notification schedule.", error: err });
        }
    });
}
exports.default = updateSchedules;
