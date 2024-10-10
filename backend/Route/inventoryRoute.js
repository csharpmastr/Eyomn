const express = require("express");
const router = express.Router();
const {
  addProductHandler,
  getProductsHandler,
  deleteProductHandler,
} = require("../Controller/inventoryController");

router.post("/add-product/:branchId", addProductHandler);
router.get("/get-products", getProductsHandler);
router.delete("/delete", deleteProductHandler);
module.exports = router;
