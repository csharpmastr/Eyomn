const {
  addPatient,
  getPatientsByDoctor,
  getPatients,
  updatePatientDetails,
  deletePatient,
  retrievePatient,
  addNote,
  getNote,
} = require("../Service/patientService");

const addPatientHandler = async (req, res) => {
  try {
    const organizationId = req.params.organizationId;
    const branchId = req.params.branchId;
    const doctorId = req.params.doctorId;
    const patientData = req.body;
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
      patientData
    );
    return res
      .status(200)
      .json({
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
    const { organizationId, branchId, doctorId, role } = req.query;
    if (!organizationId) {
      return res.status(400).json({ message: "Organization ID is required." });
    }
    const patients = await getPatients(
      organizationId,
      branchId,
      doctorId,
      role
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
    const visitId = req.params.visitId;

    if (!patientId || !visitId) {
      return res.status(400).json({
        message: "Invalid request. Missing Patient ID or Visit ID.",
      });
    }
    const note = await getNote(patientId, visitId);
    return res.status(200).json(note);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error getting patient's note.", error: error.message });
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
};
