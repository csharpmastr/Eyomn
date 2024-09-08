const express = require("express");
const {
  addStaffHandler,
  getStaffsHandler,
} = require("../Controller/staffController");
const { validateToken } = require("../Wrapper/Wrapper");

const router = express.Router();

router.post("/add", addStaffHandler);
router.post("/get-staffs", getStaffsHandler);
module.exports = router;
