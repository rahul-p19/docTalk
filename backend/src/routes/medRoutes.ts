import { Router } from "express";
import {
	getCurrentMeds,
	updateDoseLeft,
	getAllMeds,
	addMed,
	editMed,
	deleteMed,
} from "../controllers/medControllers";

const router = Router();

router.route("/today").get(getCurrentMeds).patch(updateDoseLeft);

router
	.route("/manage")
	.get(getAllMeds)
	.post(addMed)
	.put(editMed);

router.delete('/manage:id',deleteMed);	

export default router;
