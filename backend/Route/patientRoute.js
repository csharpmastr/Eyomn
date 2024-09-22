const express = require("express");
const {
  addPatientHandler,
  getPatientsByDoctorHandler,
  getPatientsHandler,
} = require("../Controller/patientController");
const { validateToken } = require("../Wrapper/Wrapper");

const router = express.Router();

router.post("/add", validateToken, addPatientHandler);
router.get("/patients-doctor", validateToken, getPatientsByDoctorHandler);
router.get("/get-all", validateToken, getPatientsHandler);

module.exports = router;
