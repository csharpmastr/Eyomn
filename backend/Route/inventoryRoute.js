const express = require("express");
const router = express.Router();
const {
  addProductHandler,
  deleteProductHandler,
  updateProductHandler,
  addPurchaseHandler,
  getOrgProductSalesHandler,
  retrieveProductHandler,
  addServiceFeeHandler,
  getBranchInventoryHandler,
  getPatientProductServicesAvailHandler,
  requestProductStockHandler,
} = require("../Controller/inventoryController");
const { validateToken } = require("../Wrapper/Wrapper");

router.post("/add/:branchId", validateToken, addProductHandler);
router.patch("/delete", validateToken, deleteProductHandler);
router.put("/update/:branchId/:productId", validateToken, updateProductHandler);
router.post("/add-purchase/:patientId?", validateToken, addPurchaseHandler);
router.get("/get-branch-inventory", validateToken, getBranchInventoryHandler);
router.get("/get-inventory", getOrgProductSalesHandler);
router.patch(
  "/retrieve-product/:branchId",
  validateToken,
  retrieveProductHandler
);
router.post("/add-service/:branchId", validateToken, addServiceFeeHandler);
router.get(
  "/get-patient-avail",
  validateToken,
  getPatientProductServicesAvailHandler
);
router.post(
  "/request-stock/:organizationId/:branchId",
  validateToken,
  requestProductStockHandler
);
module.exports = router;
