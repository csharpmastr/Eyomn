const express = require("express");
const {
  addStaffHandler,
  getStaffsHandler,
  getDoctorsListHandler,
  addBranchHandler,
} = require("../Controller/organizationController");
const { validateToken } = require("../Wrapper/Wrapper");

const router = express.Router();

router.post("/add-staff/:organizationId/:branchId", addStaffHandler);
router.post("/get-staffs", validateToken, getStaffsHandler);
router.get("/get-doctors", validateToken, getDoctorsListHandler);
router.post("/add-branch/:organizationId", addBranchHandler);

module.exports = router;
