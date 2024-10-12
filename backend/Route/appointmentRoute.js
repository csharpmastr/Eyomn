const express = require("express");
const router = express.Router();
const {
  addScheduleHandler,
  deleteScheduleHandler,
  getAppoitmentsHandler,
} = require("../Controller/appointmentController");

router.post("/add/:branchId", addScheduleHandler);
router.delete("/delete/:branchId/:appointmentId", deleteScheduleHandler);
router.get("/get-appointments", getAppoitmentsHandler);
module.exports = router;
