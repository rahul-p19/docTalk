import { Request, Response } from "express"
import prisma from "../db/prisma.js"
import bcryptjs from "bcryptjs"
export const doctorregistration = async (req: Request, res: Response) => {
    try {
        const { email, licenseNo, specialization, practiceAddress, YoE, password } = req.body;
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            return res.status(400).json({ error: "User Not Found" });
        }
        const isPasswordCorrect = await bcryptjs.compare(password, user.password);

        if (!isPasswordCorrect) {
            return res.status(400).json({ error: "Invalid credentials" });
        }
        const newDoctor = await prisma.doctorDetails.create({
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
    catch (error: any) {
        console.log("Error in doctorauth controller", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
}