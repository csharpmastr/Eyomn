const express = require("express");
const router = express.Router();
const {
  addScheduleHandler,
  deleteScheduleHandler,
  getAppoitmentsHandler,
  getDoctorAppointmentHandler,
  updateAppointmentHandler,
} = require("../Controller/appointmentController");

router.post("/add/:branchId", addScheduleHandler);
router.delete("/delete/:branchId/:appointmentId", deleteScheduleHandler);
router.get("/get-appointments", getAppoitmentsHandler);
router.get("/get-doctor-appointments", getDoctorAppointmentHandler);
router.patch("/update-appointment", updateAppointmentHandler);
module.exports = router;
