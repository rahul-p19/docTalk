"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const medControllers_1 = require("../controllers/medControllers");
const router = (0, express_1.Router)();
router.route("/today").get(medControllers_1.getCurrentMeds).patch(medControllers_1.updateDoseLeft);
router
    .route("/manage")
    .get(medControllers_1.getAllMeds)
    .post(medControllers_1.addMed)
    .put(medControllers_1.editMed);
router.delete('/manage:id', medControllers_1.deleteMed);
exports.default = router;
