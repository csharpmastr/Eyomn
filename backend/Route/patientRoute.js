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
  addVisitHandler,
  uploadImageArchiveHandler,
  getImages,
} = require("../Controller/patientController");
const { validateToken } = require("../Wrapper/Wrapper");
const multer = require("multer");

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });
router.post(
  "/add-patient/:organizationId/:branchId/:doctorId",
  addPatientHandler
);
router.get("/patients-doctor", validateToken, getPatientsByDoctorHandler);
router.get("/get-patients", validateToken, getPatientsHandler);
router.put("/update/:patientId", updatePatientHandler);
router.put("/delete/:patientId", deletePatientHandler);
router.put("/retrieve/:patientId", retrievePatientHandler);
router.post("/add-note/:patientId", addNoteHandler);
router.get("/get-notes", getPatientNoteHandler);
router.get("/get-visits", getPatientVisitsHandler);
router.post("/add-visit/:patientId/:doctorId/:branchId", addVisitHandler);
router.post(
  "/upload-image/:patientId",
  upload.single("image"),
  uploadImageArchiveHandler
);
router.get("/image-archive", getImages);
module.exports = router;
