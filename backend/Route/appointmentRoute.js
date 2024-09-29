const express = require("express");
const router = express.Router();
const {
  addScheduleHandler,
  deleteScheduleHandler,
} = require("../Controller/appointmentController");

router.post("/add/:branchId", addScheduleHandler);
router.delete("/delete/:branchId/:appointmentId", deleteScheduleHandler);
router.put("/update/:appointmentId");
module.exports = router;
