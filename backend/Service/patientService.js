const { db } = require("../Config/FirebaseConfig");
const { v4: uuidv4 } = require("uuid");
const { encryptData } = require("../Security/DataHashing");
const { collection, doc, setDoc } = require("firebase/firestore");

const addPatient = async (clinicId, patientData) => {
  try {
    const patientId = uuidv4();
    const encryptedPatientData = {};
    for (const [key, value] of Object.entries(patientData)) {
      encryptedPatientData[key] = encryptData(value);
    }
    encryptedPatientData.createdAt = new Date().toISOString();
    encryptedPatientData.patientId = patientId;

    const clinicRef = doc(db, "clinicPatients", clinicId);

    const patientsCollectionRef = collection(clinicRef, "Patients");
    await setDoc(doc(patientsCollectionRef, patientId), encryptedPatientData);
  } catch (error) {
    console.error("Error adding patient: ", error);
    throw error;
  }
};

module.exports = {
  addPatient,
};
