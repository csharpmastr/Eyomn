const { db } = require("../Config/FirebaseConfig");
const { v4: uuidv4 } = require("uuid");
const { encryptData, decryptData } = require("../Security/DataHashing");
const { collection, doc, setDoc, getDocs } = require("firebase/firestore");

const addPatient = async (clinicId, patientData) => {
  try {
    const patientId = uuidv4();
    const encryptedPatientData = {};
    for (const [key, value] of Object.entries(patientData)) {
      if (key === "doctorId") {
        encryptedPatientData[key] = value;
      } else {
        encryptedPatientData[key] = encryptData(value);
      }
    }
    encryptedPatientData.createdAt = new Date().toISOString();
    encryptedPatientData.patientId = patientId;

    const clinicRef = doc(db, "clinicPatients", clinicId);

    const patientsCollectionRef = collection(clinicRef, "Patients");
    await setDoc(doc(patientsCollectionRef, patientId), encryptedPatientData);
    return patientId;
  } catch (error) {
    console.error("Error adding patient: ", error);
    throw error;
  }
};
const getPatients = async (clinicId) => {
  try {
    const clinicRef = doc(db, "clinicPatients", clinicId);
    const patientsCollectionRef = collection(clinicRef, "Patients");

    const querySnapshot = await getDocs(patientsCollectionRef);

    const patientsData = querySnapshot.docs.map((doc) => {
      const data = doc.data();

      const decryptedData = {};
      for (const [key, value] of Object.entries(data)) {
        if (key === "createdAt" || key === "patientId" || key === "doctorId") {
          decryptedData[key] = value;
        } else {
          decryptedData[key] = decryptData(value);
        }
      }
      return {
        id: doc.id,
        ...decryptedData,
      };
    });
    return patientsData;
  } catch (error) {
    console.error("Error fetching patients: ", error);
    throw error;
  }
};

module.exports = {
  addPatient,
  getPatients,
};
