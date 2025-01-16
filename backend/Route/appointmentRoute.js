const express = require("express");
const router = express.Router();
const {
  addScheduleHandler,
  deleteScheduleHandler,
  getAppoitmentsHandler,
  getDoctorAppointmentHandler,
  updateAppointmentHandler,
} = require("../Controller/appointmentController");
const { validateToken } = require("../Wrapper/Wrapper");

router.post("/add/:branchId", validateToken, addScheduleHandler);
router.delete("/delete", validateToken, deleteScheduleHandler);
router.get("/get-appointments", validateToken, getAppoitmentsHandler);
router.get(
  "/get-doctor-appointments",
  validateToken,
  getDoctorAppointmentHandler
);
router.patch("/update-appointment", validateToken, updateAppointmentHandler);
module.exports = router;
