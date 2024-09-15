import { Request, Response, NextFunction } from "express";
import pclient from "../client.js";
import { closestTo, isFuture } from "date-fns";
import { scheduleNotif } from "../controllers/medControllers.js";
import { RRule } from "rrule";

async function updateSchedules(
	req: Request,
	res: Response,
	next: NextFunction
) {
	try {
		const allMeds = await pclient.medicine.findMany({
			where: {
				userId: req.user.id,
			},
		});
		allMeds.map((med) => {
			const updatedNextOcc = closestTo(
				new Date(),
				RRule.fromString(med.rrule).all().filter(isFuture)
			);
			if (!updatedNextOcc) med.nextOcc = new Date(0);
			else med.nextOcc = updatedNextOcc;
			scheduleNotif(med.nextOcc, med.medId, med.rrule);
		});
		next();
	} catch (err) {
		res.status(500).json({ msg: "Error in updating notification schedule.", error: err });
	}
}

export default updateSchedules;
