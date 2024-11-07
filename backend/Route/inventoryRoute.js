const express = require("express");
const router = express.Router();
const {
  addProductHandler,
  getProductsHandler,
  deleteProductHandler,
  updateProductHandler,
  addPurchaseHandler,
  getPurchasesHandler,
  getOrgProductSalesHandler,
} = require("../Controller/inventoryController");

router.post("/add/:branchId", addProductHandler);
router.get("/get-products", getProductsHandler);
router.patch("/delete", deleteProductHandler);
router.put("/update/:branchId/:productId", updateProductHandler);
router.post("/add-purchase/:branchId/:staffId", addPurchaseHandler);
router.get("/get-purchases", getPurchasesHandler);
router.get("/get-product-sales", getOrgProductSalesHandler);
module.exports = router;
