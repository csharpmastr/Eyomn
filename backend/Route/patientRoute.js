const express = require("express");
const {
  addPatientHandler,
  getPatientsHanlder,
} = require("../Controller/patientController");
const { validateToken } = require("../Wrapper/Wrapper");

const router = express.Router();

router.post("/add", validateToken, addPatientHandler);
router.post("/get-patients", getPatientsHanlder);

module.exports = router;
