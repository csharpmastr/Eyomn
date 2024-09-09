const express = require("express");
const {
  addPatientHandler,
  getPatientsHandler,
} = require("../Controller/patientController");
const { validateToken } = require("../Wrapper/Wrapper");

const router = express.Router();

router.post("/add", validateToken, addPatientHandler);
router.get("/get-patients", validateToken, getPatientsHandler);

module.exports = router;
