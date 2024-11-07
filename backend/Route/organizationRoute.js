const express = require("express");
const {
  addStaffHandler,
  getStaffsHandler,
  getDoctorsListHandler,
  addBranchHandler,
  getBranchDataHandler,
  getOrgProductSalesHandler,
} = require("../Controller/organizationController");
const { validateToken } = require("../Wrapper/Wrapper");

const router = express.Router();

router.post("/add-staff/:organizationId", addStaffHandler);
router.get("/get-staffs", getStaffsHandler);
router.get("/get-doctors", getDoctorsListHandler);
router.post("/add-branch/:organizationId", addBranchHandler);
router.get("/get-branch-data/:organizationId", getBranchDataHandler);
router.get("/get-product-sales", getOrgProductSalesHandler);

module.exports = router;
