const { addPatient } = require("../Service/patientService");

const addPatientHandler = async (req, res) => {
  try {
    const { clinicId, ...patientData } = req.body;
    if (!clinicId || Object.keys(patientData).length === 0) {
      return res
        .status(400)
        .json({ message: "Clinic ID and patient data are required." });
    }
    await addPatient(clinicId, patientData);
  } catch (error) {
    console.error("Error adding patient: ", error);
    res
      .status(500)
      .json({ message: "Error adding patient.", error: error.message });
  }
};

module.exports = {
  addPatientHandler,
};
