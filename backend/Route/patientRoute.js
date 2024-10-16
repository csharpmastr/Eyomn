const express = require("express");
const {
  addPatientHandler,
  getPatientsByDoctorHandler,
  getPatientsHandler,
  updatePatientHandler,
  deletePatientHandler,
  retrievePatientHandler,
  addNoteHandler,
  getPatientNoteHandler,
  getPatientVisitsHandler,
} = require("../Controller/patientController");
const { validateToken } = require("../Wrapper/Wrapper");

const router = express.Router();

router.post(
  "/add-patient/:organizationId/:branchId/:doctorId",
  addPatientHandler
);
router.get("/patients-doctor", validateToken, getPatientsByDoctorHandler);
router.get("/get-patients", validateToken, getPatientsHandler);
router.put("/update/:patientId", updatePatientHandler);
router.put("/delete/:patientId", deletePatientHandler);
router.put("/retrieve/:patientId", retrievePatientHandler);
router.post("/add-note/:patientId/:visitId", addNoteHandler);
router.get("/get-note/:patientId/:visitId", getPatientNoteHandler);
router.get("/get-visits", getPatientVisitsHandler);
module.exports = router;
