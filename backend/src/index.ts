import express from "express";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/authRoutes.js";
import messageRoutes from "./routes/messagesRoute.js";
import doctorRoutes from "./routes/doctorRoutes.js"
import protectRoute from "./middlewares/protectRoute.js";
import updateSchedules from "./middlewares/updateSchedule.js";

import medRoute from "./routes/medRoutes";

const cors = require('cors')
const dotenv = require("dotenv");
dotenv.config();
const app = express();


app.use(cookieParser());
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/messages", messageRoutes);
app.use("/doctor", doctorRoutes)


app.use(cors({
  origin: "http://localhost:5173"
}))

app.use("/medicines", protectRoute, updateSchedules, medRoute);
app.get("/test/",(req,res)=>{
  res.status(200);
  res.send({
    msg: " hello from server"
  });
})

app.listen(process.env.PORT, () => {
  console.log(`application running on port ${process.env.PORT}`)
})