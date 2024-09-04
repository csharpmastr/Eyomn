const express = require("express");
const { addStaffHandler } = require("../Controller/staffController");

const router = express.Router();

router.post("/add", addStaffHandler);

module.exports = router;
