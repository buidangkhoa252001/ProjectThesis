import express from "express";
import eventSchedule from "../controllers/eventScheduleCtrl";
import { auth } from "../middleware/auth";
const eventScheduleRoute = express.Router();

eventScheduleRoute.post("/create-event",auth, eventSchedule.createEvent);
eventScheduleRoute.get("/search", auth, eventSchedule.searchEvent);



     
export default eventScheduleRoute;
