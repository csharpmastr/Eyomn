const {
  addPatient,
  getPatientsByDoctor,
  getPatients,
} = require("../Service/patientService");

const addPatientHandler = async (req, res) => {
  try {
    const { clinicId, ...patientData } = req.body;
    if (!clinicId || Object.keys(patientData).length === 0) {
      return res
        .status(400)
        .json({ message: "Clinic ID and patient data are required." });
    }
    const id = await addPatient(clinicId, patientData);
    return res
      .status(200)
      .json({ message: "Patient added successfully", id: id });
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
    const { clinicId } = req.query;
    if (!clinicId) {
      return res.status(400).json({ message: "Clinic ID is required." });
    }
    const patients = await getPatients(clinicId);
    return res.status(200).json(patients);
  } catch (error) {
    console.error("Error fetching patients: ", error);
    return res
      .status(500)
      .json({ message: "Error fetching patients.", error: error.message });
  }
};

module.exports = {
  addPatientHandler,
  getPatientsByDoctorHandler,
  getPatientsHandler,
};
