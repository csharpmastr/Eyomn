const express = require("express");
const {
  addStaffHandler,
  getStaffsHandler,
  getDoctorsListHandler,
  addBranchHandler,
  getBranchDataHandler,
  getOrgProductSalesHandler,
  getBranchNameHandler,
} = require("../Controller/organizationController");
const { validateToken } = require("../Wrapper/Wrapper");

const router = express.Router();

router.post("/add-staff/:organizationId", validateToken, addStaffHandler);
router.get("/get-staffs", validateToken, getStaffsHandler);
router.get("/get-doctors", validateToken, getDoctorsListHandler);
router.post("/add-branch/:organizationId", validateToken, addBranchHandler);
router.get(
  "/get-branch-data/:organizationId",
  validateToken,
  getBranchDataHandler
);
router.get("/get-branch-name", validateToken, getBranchNameHandler);
module.exports = router;
