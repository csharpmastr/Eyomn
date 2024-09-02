const express = require("express");
const { addPatientHandler } = require("../Controller/patientController");

const router = express.Router();

router.post("/add", addPatientHandler);

module.exports = router;
