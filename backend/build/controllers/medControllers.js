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
exports.getCurrentMeds = getCurrentMeds;
exports.updateDoseLeft = updateDoseLeft;
exports.getAllMeds = getAllMeds;
exports.addMed = addMed;
exports.editMed = editMed;
exports.deleteMed = deleteMed;
exports.scheduleNotif = scheduleNotif;
const client_1 = __importDefault(require("../client"));
const rrule_1 = require("rrule");
const node_schedule_1 = __importDefault(require("node-schedule"));
const date_fns_1 = require("date-fns");
function getCurrentMeds(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const userId = req.user.id;
            const meds = yield client_1.default.medicine.findMany({
                where: {
                    user: {
                        // username: req.params.uname,
                        id: userId,
                    },
                },
            });
            if (!meds)
                throw new Error(`No medicines found for user ${userId}`);
            const currentMeds = [];
            meds.map((med) => {
                const rrule = rrule_1.RRule.fromString(med.rrule);
                rrule
                    .between((0, date_fns_1.startOfToday)(), (0, date_fns_1.addDays)((0, date_fns_1.startOfToday)(), 1))
                    .forEach((occ) => {
                    currentMeds.push({
                        medId: med.medId,
                        name: med.name,
                        dosage: med.dosage,
                        time: occ,
                    });
                });
            });
            return res.json(currentMeds);
        }
        catch (error) {
            return res.json({ error: error });
        }
    });
}
function updateDoseLeft(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const medId = req.body;
            const temp = yield client_1.default.medicine.findFirst({
                where: {
                    medId: medId,
                },
                select: {
                    nextOcc: true,
                    rrule: true,
                },
            });
            if (!temp)
                throw new Error(`No medicine found with medId- ${medId}`);
            let nextOcc;
            if (!temp.nextOcc)
                nextOcc = "";
            else
                nextOcc = (0, date_fns_1.closestTo)((0, date_fns_1.addSeconds)(temp.nextOcc, 1), rrule_1.RRule.fromString(temp.rrule).all().filter(date_fns_1.isFuture));
            yield client_1.default.medicine.update({
                where: {
                    medId: medId,
                },
                data: {
                    nextOcc: nextOcc,
                    doseLeft: {
                        decrement: 1,
                    },
                    stockLeft: {
                        decrement: 1,
                    },
                },
            });
            return res.json({ msg: `Next occurence updated.` });
        }
        catch (error) {
            return res.json({ error: error });
        }
    });
}
function getAllMeds(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const meds = yield client_1.default.medicine.findMany({
                where: {
                    user: {
                        // email: req.params.id,
                        id: req.user.id,
                    },
                },
                select: {
                    medId: true,
                    name: true,
                    dosage: true,
                    doseLeft: true,
                    stockLeft: true,
                    rrule: true,
                },
            });
            return res.json(meds);
        }
        catch (err) {
            return res.json({ error: err });
        }
    });
}
function addMed(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const med = req.body;
            /*const userIdObj = await pclient.user.findFirst({
                where: {
                    email: req.params.id,
                },
                select: {
                    id: true,
                },
            });
            if (!userIdObj)
                throw new Error(`No user found with email ${req.params.id}`);
            const userId = userIdObj.id;*/
            const userId = req.user.id;
            med.nextOcc = (0, date_fns_1.closestTo)(new Date(), rrule_1.RRule.fromString(med.rrule).all().filter(date_fns_1.isFuture));
            if (!userId)
                throw new Error(`No user found with id ${userId}`);
            const newMed = yield client_1.default.medicine.create({
                data: {
                    name: med.name,
                    userId: userId,
                    dosage: med.dosage,
                    doseLeft: med.doseLeft,
                    stockLeft: med.stockLeft,
                    nextOcc: med.nextOcc,
                    rrule: med.rrule,
                },
            });
            scheduleNotif(med.nextOcc, newMed.medId, med.rrule);
            return res.json({ msg: `Medicine ${med.name} created.` });
        }
        catch (err) {
            return res.json({ error: err });
        }
    });
}
function editMed(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const med = req.body;
            med.nextOcc = (0, date_fns_1.closestTo)(new Date(), rrule_1.RRule.fromString(med.rrule).all().filter(date_fns_1.isFuture));
            scheduleNotif(med.nextOcc, med.medId, med.rrule);
            const updatedMed = yield client_1.default.medicine.update({
                where: {
                    medId: med.medId,
                    user: {
                        // email: req.params.id,
                        id: req.user.id,
                    },
                },
                data: med,
            });
            if (!updatedMed)
                throw new Error(`No medicine found with id- ${med.medId}`);
            return res.json({
                msg: `Medicine with id- ${med.medId} updated successfully`,
            });
        }
        catch (err) {
            return res.json({ error: err });
        }
    });
}
function deleteMed(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const medId = req.params.id;
            const deletedMed = yield client_1.default.medicine.delete({
                where: {
                    medId: medId,
                },
            });
            if (!deletedMed)
                throw new Error(`No medicine found with id- ${medId}`);
            return res.json({ msg: `Medicine with id- ${medId} deleted.` });
        }
        catch (err) {
            return res.json({ error: err });
        }
    });
}
function scheduleNotif(nextOcc, medId, rrule) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!nextOcc)
            return;
        const notif = node_schedule_1.default.scheduleJob(nextOcc, () => {
            sendNotif(medId);
            const updatedNextOcc = (0, date_fns_1.closestTo)(new Date(), rrule_1.RRule.fromString(rrule).all().filter(date_fns_1.isFuture));
            if (!updatedNextOcc)
                return;
            scheduleNotif(updatedNextOcc, medId, rrule);
        });
    });
}
function sendNotif(medId) {
    return __awaiter(this, void 0, void 0, function* () {
        const med = yield client_1.default.medicine.findFirst({
            where: {
                medId: medId,
            },
        });
        if (med)
            console.log(`Take ${med.dosage} of ${med.name}. `, new Date());
    });
}
