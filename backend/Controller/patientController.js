const { getVisits } = require("../Helper/Helper");
const {
  addPatient,
  getPatientsByDoctor,
  getPatients,
  updatePatientDetails,
  deletePatient,
  retrievePatient,
  addNote,
  getNote,
  testingNote,
  addVisit,
} = require("../Service/patientService");

const addPatientHandler = async (req, res) => {
  try {
    const organizationId = req.params.organizationId;
    const branchId = req.params.branchId;
    const doctorId = req.params.doctorId;
    const { firebaseUid } = req.query;
    const patientData = req.body;
    console.log(`Doctor ID : ${doctorId}`);

    if (
      !branchId ||
      !organizationId ||
      !doctorId ||
      Object.keys(patientData).length === 0
    ) {
      return res.status(400).json({
        message:
          "Organization ID, branch ID, doctor ID, and patient data are required.",
      });
    }
    const { id, createdAt } = await addPatient(
      organizationId,
      branchId,
      doctorId,
      patientData,
      firebaseUid
    );
    return res.status(200).json({
      message: "Patient added successfully",
      id: id,
      createdAt: createdAt,
    });
  } catch (error) {
    console.error("Error adding patient: ", error);
    res
      .status(500)
      .json({ message: "Error adding patient.", error: error.message });
  }
};
const getPatientsByDoctorHandler = async (req, res) => {
  try {
    const { clinicId, doctorId } = req.query;
    if (!clinicId) {
      return res.status(400).json({ message: "Clinic ID is required." });
    }
    const patients = await getPatientsByDoctor(clinicId, doctorId);
    return res.status(200).json(patients);
  } catch (error) {
    console.error("Error fetching patients: ", error);
    return res
      .status(500)
      .json({ message: "Error fetching patients.", error: error.message });
  }
};

const getPatientsHandler = async (req, res) => {
  try {
    const { organizationId, branchId, doctorId, role, firebaseUid } = req.query;
    if (!organizationId) {
      return res.status(400).json({ message: "Organization ID is required." });
    }
    console.log(firebaseUid);

    const patients = await getPatients(
      organizationId,
      branchId,
      doctorId,
      role,
      firebaseUid
    );
    return res.status(200).json(patients);
  } catch (error) {
    console.error("Error fetching patients: ", error);
    return res
      .status(500)
      .json({ message: "Error fetching patients.", error: error.message });
  }
};

const updatePatientHandler = async (req, res) => {
  try {
    const patientData = req.body;
    const patientId = req.params.patientId;
    if (!patientId || !patientData) {
      return res.status(400).json({
        message: "Invalid request. Missing patientId or patientData.",
      });
    }
    await updatePatientDetails(patientId, patientData);
    return res.status(200).json({ message: "Patient details updated" });
  } catch (error) {
    console.error("Error updating patient details: ", error);
    return res.status(500).json({
      message: "Error updating patient details",
      error: error.message,
    });
  }
};

const deletePatientHandler = async (req, res) => {
  try {
    const patientId = req.params.patientId;

    if (!patientId) {
      return res.status(400).json({ message: "No patient ID" });
    }
    await deletePatient(patientId);
    return res.status(200).json({ message: "Patient deleted." });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error deleting patients.", error: error.message });
  }
};
const retrievePatientHandler = async (req, res) => {
  try {
    const patientId = req.params.patientId;
    if (!patientId) {
      return res.status(400).json({ message: "No patient ID" });
    }
    await retrievePatient(patientId);
    return res.status(200).json({ message: "Patient retrieved." });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error retrieving patients.", error: error.message });
  }
};
const addNoteHandler = async (req, res) => {
  try {
    const patientId = req.params.patientId;
    const visitId = req.params.visitId;
    const noteDetails = req.body;

    if (!patientId || !visitId || !noteDetails) {
      return res.status(400).json({
        message: "Invalid request. Missing Patient ID or Visit ID.",
      });
    }
    await addNote(patientId, visitId, noteDetails);
    return res.status(200).json({ message: "Notes Added." });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error adding patient's note.", error: error.message });
  }
};

const getPatientNoteHandler = async (req, res) => {
  try {
    const patientId = req.params.patientId;
    const { firebaseUid } = req.query;
    const visitId = req.params.visitId;

    if (!patientId || !visitId) {
      return res.status(400).json({
        message: "Invalid request. Missing Patient ID or Visit ID.",
      });
    }
    const note = await getNote(patientId, visitId, firebaseUid);
    return res.status(200).json(note);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error getting patient's note.", error: error.message });
  }
};

const getPatientVisitsHandler = async (req, res) => {
  try {
    const { patientId, firebaseUid } = req.query;
    if (!patientId) {
      return res.status(401).json({ message: "Please provide Patient ID" });
    }
    const visits = await getVisits(patientId, firebaseUid);
    if (visits) {
      return res.status(200).json(visits);
    }
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error getting patient's note.", error: error.message });
  }
};
const addVisitHandler = async (req, res) => {
  try {
    const patientId = req.params.patientId;
    const branchId = req.params.branchId;
    const doctorId = req.params.doctorId;

    // Assuming req.body is structured like this:
    // {
    //   reason_visit: {
    //     reason_visit: "check up"
    //   }
    // }
    const reason_visit = req.body.reason_visit?.reason_visit; // Extracting the string value
    const { firebaseUid } = req.query;

    if (!patientId || !branchId || !doctorId || !reason_visit) {
      return res.status(400).json({
        message:
          "Please provide Patient ID, Branch ID, Doctor ID, and Reason for Visit.",
      });
    }

    console.log("Reason for visit:", reason_visit); // Log the extracted reason_visit

    const { visitId, date } = await addVisit(
      patientId,
      doctorId,
      reason_visit, // Use the extracted reason_visit string
      branchId,
      firebaseUid
    );

    return res.status(201).json({
      message: "Visit added successfully.",
      visitId,
      date,
    });
  } catch (error) {
    console.error("Error adding visit:", error);
    return res
      .status(500)
      .json({ message: "Failed to add visit: " + error.message });
  }
};

module.exports = {
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
};
