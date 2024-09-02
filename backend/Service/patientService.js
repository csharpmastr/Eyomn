const { db } = require("../Config/FirebaseConfig");
const { v4: uuidv4 } = require("uuid");
const { encryptData } = require("../Security/DataHashing");
const { collection, doc, setDoc } = require("firebase/firestore");

const addPatient = async (clinicId, patientData) => {
  try {
    const encryptedPatientData = {
      first_name: encryptData(patientData.first_name),
      last_name: encryptData(patientData.last_name),
      address: encryptData(patientData.address),
    };

    const patientId = uuidv4();

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
