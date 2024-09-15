import { Request, Response } from "express";
import pclient from "../client";
import { RRule } from "rrule";
import schedule from "node-schedule";
import {
	addDays,
	startOfToday,
	closestTo,
	addSeconds,
	isFuture,
} from "date-fns";

interface medsToday {
	medId: string;
	name: string;
	dosage: string;
	time: Date;
}

async function getCurrentMeds(req: Request, res: Response) {
	try {
		const userId = req.user.id;
		const meds = await pclient.medicine.findMany({
			where: {
				user: {
					// username: req.params.uname,
					id: userId,
				},
			},
		});

		if (!meds) throw new Error(`No medicines found for user ${userId}`);
		const currentMeds: medsToday[] = [];

		meds.map((med) => {
			const rrule = RRule.fromString(med.rrule);
			rrule
				.between(startOfToday(), addDays(startOfToday(), 1))
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
	} catch (error) {
		return res.json({ error: error });
	}
}

async function updateDoseLeft(req: Request, res: Response) {
	try {
		const medId = req.body;
		const temp = await pclient.medicine.findFirst({
			where: {
				medId: medId,
			},
			select: {
				nextOcc: true,
				rrule: true,
			},
		});
		if (!temp) throw new Error(`No medicine found with medId- ${medId}`);
		let nextOcc;
		if(!temp.nextOcc) nextOcc = "";
		else nextOcc = closestTo(
				addSeconds(temp.nextOcc, 1),
				RRule.fromString(temp.rrule).all().filter(isFuture)
			);

		await pclient.medicine.update({
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
	} catch (error) {
		return res.json({ error: error });
	}
}

async function getAllMeds(req: Request, res: Response) {
	try {
		const meds = await pclient.medicine.findMany({
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
	} catch (err) {
		return res.json({ error: err });
	}
}

async function addMed(req: Request, res: Response) {
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
		med.nextOcc = closestTo(
			new Date(),
			RRule.fromString(med.rrule).all().filter(isFuture)
		);
		if (!userId) throw new Error(`No user found with id ${userId}`);
		const newMed = await pclient.medicine.create({
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
	} catch (err) {
		return res.json({ error: err });
	}
}

async function editMed(req: Request, res: Response) {
	try {
		const med = req.body;
		med.nextOcc = closestTo(
			new Date(),
			RRule.fromString(med.rrule).all().filter(isFuture)
		);
		scheduleNotif(med.nextOcc, med.medId, med.rrule);
		const updatedMed = await pclient.medicine.update({
			where: {
				medId: med.medId,
				user: {
					// email: req.params.id,
					id: req.user.id,
				},
			},
			data: med,
		});
		if (!updatedMed) throw new Error(`No medicine found with id- ${med.medId}`);
		return res.json({
			msg: `Medicine with id- ${med.medId} updated successfully`,
		});
	} catch (err) {
		return res.json({ error: err });
	}
}

async function deleteMed(req: Request, res: Response) {
	try {
		const medId = req.params.id;
		const deletedMed = await pclient.medicine.delete({
			where: {
				medId: medId,
			},
		});
		if (!deletedMed) throw new Error(`No medicine found with id- ${medId}`);
		return res.json({ msg: `Medicine with id- ${medId} deleted.` });
	} catch (err) {
		return res.json({ error: err });
	}
}

async function scheduleNotif(nextOcc: Date, medId: string, rrule: string) {
	if (!nextOcc) return;
	const notif = schedule.scheduleJob(nextOcc, () => {
		sendNotif(medId);
		const updatedNextOcc = closestTo(
			new Date(),
			RRule.fromString(rrule).all().filter(isFuture)
		);
		if (!updatedNextOcc) return;
		scheduleNotif(updatedNextOcc, medId, rrule);
	});
}

async function sendNotif(medId: string) {
	const med = await pclient.medicine.findFirst({
		where: {
			medId: medId,
		},
	});
	if (med) console.log(`Take ${med.dosage} of ${med.name}. `, new Date());
}

export {
	getCurrentMeds,
	updateDoseLeft,
	getAllMeds,
	addMed,
	editMed,
	deleteMed,
	scheduleNotif,
};
