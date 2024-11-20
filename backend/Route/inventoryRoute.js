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
} = require("../Controller/inventoryController");

router.post("/add/:branchId", addProductHandler);
router.patch("/delete", deleteProductHandler);
router.put("/update/:branchId/:productId", updateProductHandler);
router.post("/add-purchase/:branchId/:staffId", addPurchaseHandler);
router.get("/get-branch-inventory", getBranchInventoryHandler);
router.get("/get-inventory", getOrgProductSalesHandler);
router.patch("/retrieve-product/:branchId", retrieveProductHandler);
router.post("/add-service/:branchId", addServiceFeeHandler);
module.exports = router;
