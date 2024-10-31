const express = require("express");
const router = express.Router();
const {
  addProductHandler,
  getProductsHandler,
  deleteProductHandler,
  updateProductHandler,
  addPurchaseHandler,
  getPurchasesHandler,
} = require("../Controller/inventoryController");

router.post("/add/:branchId", addProductHandler);
router.get("/get-products", getProductsHandler);
router.delete("/delete", deleteProductHandler);
router.put("/update/:branchId/:productId", updateProductHandler);
router.post("/add-purchase/:branchId/:staffId", addPurchaseHandler);
router.get("/get-purchases", getPurchasesHandler);

module.exports = router;
