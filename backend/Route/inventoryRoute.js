const express = require("express");
const router = express.Router();
const { addProductHandler } = require("../Controller/inventoryController");

router.post("/add-product/:branchId", addProductHandler);

module.exports = router;
