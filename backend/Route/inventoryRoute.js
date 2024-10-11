const express = require("express");
const router = express.Router();
const {
  addProductHandler,
  getProductsHandler,
  deleteProductHandler,
  updateProductHandler,
} = require("../Controller/inventoryController");

router.post("/add-product/:branchId", addProductHandler);
router.get("/get-products", getProductsHandler);
router.delete("/delete-product", deleteProductHandler);
router.put("/update-product/:branchId/:productId", updateProductHandler);
module.exports = router;
