const express = require("express");
const {
  addStaffHandler,
  getStaffsHandler,
  getDoctorsListHandler,
} = require("../Controller/staffController");
const { validateToken } = require("../Wrapper/Wrapper");

const router = express.Router();

router.post("/add", validateToken, addStaffHandler);
router.post("/get-staffs", validateToken, getStaffsHandler);
router.get("/get-doctors", validateToken, getDoctorsListHandler);
module.exports = router;
