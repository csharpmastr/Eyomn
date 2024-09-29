const admin = require("firebase-admin");
const { v4: uuidv4 } = require("uuid");
const { encryptData, decryptData } = require("../Security/DataHashing");
const {
  db,
  patientCollection,
  branchCollection,
} = require("../Config/FirebaseConfig");

const addPatient = async (organizationId, branchId, doctorId, patientData) => {
  const currentDate = new Date();
  if ((!organizationId || !branchId, !doctorId)) {
    throw new Error("Organization ID, Branch ID, and Doctor ID are required.");
  }
  try {
    const patientId = uuidv4();
    const encryptedPatientData = {
      doctorId,
      patientId,
      organizationId,
      branchId,
      createdAt: currentDate.toISOString(),
      isDeleted: false,
    };

    for (const [key, value] of Object.entries(patientData)) {
      if (
        key === "doctorId" ||
        key === "patientId" ||
        key === "organizationId" ||
        key === "branchId" ||
        key !== "isDeleted"
      ) {
        encryptedPatientData[key] = value;
      } else {
        encryptedPatientData[key] = encryptData(value);
      }
    }

    const branchRef = branchCollection.doc(branchId);
    await branchRef.update({
      patients: admin.firestore.FieldValue.arrayUnion(patientId),
    });

    const patientRef = patientCollection.doc(patientId);
    await patientRef.set(encryptedPatientData);

    await addVisit(patientId, doctorId);
    return patientId;
  } catch (error) {
    console.error("Error adding patient: ", error);
    throw error;
  }
};
const addVisit = async (patientId, doctorId) => {
  const currentDate = new Date();
  const visitId = uuidv4();

  const patientRef = patientCollection.doc(patientId);
  const visitSubColRef = patientRef.collection("visit").doc(visitId);

  const visitData = {
    visitId,
    date: currentDate.toISOString(),
    doctorId,
  };

  await visitSubColRef.set(visitData);
  console.log(`Visit added for patient ${patientId} with visit ID: ${visitId}`);
};
const addNote = async (patientId, visitId, noteDetails) => {
  try {
    const noteId = uuidv4();
    const noteRef = patientCollection
      .doc(patientId)
      .collection("notes")
      .doc(visitId);

    const encryptedNoteDetails = {};

    const encryptValue = (value) => {
      if (typeof value === "string" && isNaN(Date.parse(value))) {
        return encryptData(value);
      }
      return value;
    };

    for (const [key, value] of Object.entries(noteDetails)) {
      if (
        typeof value === "object" &&
        value !== null &&
        !Array.isArray(value)
      ) {
        encryptedNoteDetails[key] = Object.fromEntries(
          Object.entries(value).map(([nestedKey, nestedValue]) => [
            nestedKey,
            encryptValue(nestedValue),
          ])
        );
      } else {
        encryptedNoteDetails[key] = encryptValue(value);
      }
    }

    await noteRef.set({
      noteId,
      ...encryptedNoteDetails,
      createdAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error adding note:", error);
    throw error;
  }
};

const getNote = async (patientId, visitId) => {
  try {
    const noteRef = patientCollection
      .doc(patientId)
      .collection("notes")
      .doc(visitId);

    const noteData = await noteRef.get();

    if (!noteData.exists) {
      throw new Error("Note not found");
    }

    const decryptedNoteDetails = {};
    const noteDetails = noteData.data();

    const decryptValue = (key, value) => {
      if (key === "noteId" || key === "createdAt") {
        return value;
      }
      if (typeof value === "string" && isNaN(Date.parse(value))) {
        return decryptData(value);
      }
      return value;
    };

    for (const [key, value] of Object.entries(noteDetails)) {
      if (
        typeof value === "object" &&
        value !== null &&
        !Array.isArray(value)
      ) {
        decryptedNoteDetails[key] = Object.fromEntries(
          Object.entries(value).map(([nestedKey, nestedValue]) => [
            nestedKey,
            decryptValue(nestedKey, nestedValue),
          ])
        );
      } else {
        decryptedNoteDetails[key] = decryptValue(key, value);
      }
    }

    return decryptedNoteDetails;
  } catch (error) {
    console.error("Error getting note:", error);
    throw error;
  }
};

const updatePatientDetails = async (patientId, patientData) => {
  try {
    const patientDocRef = patientCollection.doc(patientId);

    const encryptedPatientData = {};
    Object.keys(patientData).forEach((key) => {
      encryptedPatientData[key] = encryptData(patientData[key]);
    });

    await patientDocRef.update(encryptedPatientData);
  } catch (error) {
    console.error(`Error updating patient ${patientId}:`, error);
    throw new Error("Failed to update patient details");
  }
};

const deletePatient = async (patientId) => {
  try {
    const patientRef = patientCollection.doc(patientId);

    await patientRef.update({ isDeleted: true });
  } catch (error) {
    console.error(`Error deleting patient ${patientId}:`, error);
    throw new Error("Failed to delete patient");
  }
};
const retrievePatient = async (patientId) => {
  try {
    const patientRef = patientCollection.doc(patientId);
    await patientRef.update({ isDeleted: false });
  } catch (error) {
    console.error(`Error retrieving patient ${patientId}:`, error);
    throw new Error("Failed to retrieve patient");
  }
};
// const getPatients = async (clinicId) => {
//   try {
//     const patientsCollectionRef = db.collection("clinicPatients").doc(clinicId).collection("Patients");

//     const querySnapshot = await patientsCollectionRef.get();

//     if (querySnapshot.empty) {
//       return [];
//     }

//     const patientsData = querySnapshot.docs.map((doc) => {
//       const data = doc.data();
//       const decryptedData = {};

//       for (const [key, value] of Object.entries(data)) {
//         if (key === "createdAt" || key === "patientId" || key === "doctorId") {
//           decryptedData[key] = value;
//         } else {
//           decryptedData[key] = decryptData(value);
//         }
//       }

//       return decryptedData;
//     });

//     return patientsData;
//   } catch (err) {
//     console.error("Error getting patients:", err);
//     throw new Error("Failed to retrieve patients");
//   }
// };

// const getPatientsByDoctor = async (clinicId, doctorId) => {
//   try {
//     const patientsCollectionRef = db.collection("clinicPatients").doc(clinicId).collection("Patients");

//     const querySnapshot = await patientsCollectionRef.where("doctorId", "==", doctorId).get();

//     if (querySnapshot.empty) {
//       console.log("No patients found for the given clinic and doctor.");
//       return [];
//     }

//     const patientsData = querySnapshot.docs.map((doc) => {
//       const data = doc.data();
//       const decryptedData = {};

//       for (const [key, value] of Object.entries(data)) {
//         if (key === "createdAt" || key === "patientId" || key === "doctorId") {
//           decryptedData[key] = value;
//         } else {
//           decryptedData[key] = decryptData(value);
//         }
//       }

//       return {
//         id: doc.id,
//         ...decryptedData,
//       };
//     });

//     return patientsData;
//   } catch (error) {
//     console.error("Error fetching patients: ", error);
//     throw error;
//   }
// };

module.exports = {
  addPatient,
  updatePatientDetails,
  deletePatient,
  retrievePatient,
  addNote,
  getNote,
  // getPatientsByDoctor,
  // getPatients,
};
