const express = require("express");
const {
  addStaffHandler,
  getStaffsHandler,
  getDoctorsListHandler,
  addBranchHandler,
  getBranchDataHandler,
} = require("../Controller/organizationController");
const { validateToken } = require("../Wrapper/Wrapper");

const router = express.Router();

router.post("/add-staff/:organizationId", addStaffHandler);
router.post("/get-staffs", validateToken, getStaffsHandler);
router.get("/get-doctors", getDoctorsListHandler);
router.post("/add-branch/:organizationId", addBranchHandler);
router.get("/get-branch-data/:organizationId", getBranchDataHandler);

module.exports = router;
