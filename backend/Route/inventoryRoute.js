const express = require("express");
const router = express.Router();
const {
  addProductHandler,
  getProductsHandler,
} = require("../Controller/inventoryController");

router.post("/add-product/:branchId", addProductHandler);
router.get("/get-products", getProductsHandler);

module.exports = router;
