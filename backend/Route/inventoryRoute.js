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
  getProductStockRequestsHandler,
  processProductRequestHandler,
  updateStatusHandler,
  getBranchRequestHandler,
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
router.get("/get-stock-requests", getProductStockRequestsHandler);
router.post("/process-request", validateToken, processProductRequestHandler);
router.patch(
  "/update-request-status/:requestId",
  validateToken,
  updateStatusHandler
);
router.get("/get-branch-requests", validateToken, getBranchRequestHandler);
module.exports = router;
