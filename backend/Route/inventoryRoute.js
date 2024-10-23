const express = require("express");
const router = express.Router();
const {
  addProductHandler,
  getProductsHandler,
  deleteProductHandler,
  updateProductHandler,
  addPurchaseHandler,
} = require("../Controller/inventoryController");

router.post("/add/:branchId", addProductHandler);
router.get("/get-products", getProductsHandler);
router.delete("/delete", deleteProductHandler);
router.put("/update/:branchId/:productId", updateProductHandler);
router.post("/add-purchase/:branchId/:staffId", addPurchaseHandler);
module.exports = router;
