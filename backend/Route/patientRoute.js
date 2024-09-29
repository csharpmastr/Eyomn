const express = require("express");
const {
  addPatientHandler,
  getPatientsByDoctorHandler,
  getPatientsHandler,
  updatePatientHandler,
  deletePatientHandler,
  retrievePatientHandler,
} = require("../Controller/patientController");
const { validateToken } = require("../Wrapper/Wrapper");

const router = express.Router();

router.post(
  "/add-patient/:organizationId/:branchId/:doctorId",
  addPatientHandler
);
router.get("/patients-doctor", validateToken, getPatientsByDoctorHandler);
router.get("/get-all", validateToken, getPatientsHandler);
router.put("/update/:patientId", updatePatientHandler);
router.put("/delete/:patientId", deletePatientHandler);
router.put("/retrieve/:patientId", retrievePatientHandler);
module.exports = router;
