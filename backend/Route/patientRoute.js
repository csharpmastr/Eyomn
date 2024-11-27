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
  sharePatientHandler,
  generateStoreSoapHandler,
  getAllPatientVisitsHandler,
} = require("../Controller/patientController");
const { validateToken } = require("../Wrapper/Wrapper");
const multer = require("multer");

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });
router.post(
  "/add-patient/:organizationId/:branchId/:doctorId",
  validateToken,
  addPatientHandler
);
router.get("/patients-doctor", validateToken, getPatientsByDoctorHandler);
router.get("/get-patients", validateToken, getPatientsHandler);
router.patch("/update/:patientId", validateToken, updatePatientHandler);
router.put("/delete/:patientId", validateToken, deletePatientHandler);
router.put("/retrieve/:patientId", validateToken, retrievePatientHandler);
router.post("/add-note/:patientId", validateToken, addNoteHandler);
router.get("/get-notes", validateToken, getPatientNoteHandler);
router.get("/get-visits", validateToken, getPatientVisitsHandler);
router.post(
  "/add-visit/:patientId/:doctorId/:branchId",
  validateToken,
  addVisitHandler
);
router.post(
  "/upload-image/:patientId",
  upload.single("image"),
  uploadImageArchiveHandler
);
router.get("/image-archive", getImages);
router.patch("/share-patient/:patientId", sharePatientHandler);
router.post("/add-soap/:patientId", generateStoreSoapHandler);
router.get("/get-all-visits", getAllPatientVisitsHandler);
module.exports = router;
