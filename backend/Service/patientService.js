const admin = require("firebase-admin");
const { v4: uuidv4 } = require("uuid");
const { encryptData, decryptData } = require("../Security/DataHashing");
const {
  db,
  patientCollection,
  branchCollection,
} = require("../Config/FirebaseConfig");
const { encryptDocument, decryptDocument } = require("../Helper/Helper");
const { pushNotification } = require("./notificationService");

const addPatient = async (
  organizationId,
  branchId,
  doctorId,
  patientData,
  firebaseUid
) => {
  const currentDate = new Date();

  try {
    const userRecord = await admin.auth().getUser(firebaseUid);
    if (!userRecord) {
      throw { status: 404, message: "User not found." };
    }
    if ((!organizationId || !branchId, !doctorId)) {
      throw new Error(
        "Organization ID, Branch ID, and Doctor ID are required."
      );
    }
    const patientId = uuidv4();
    const basePatientData = {
      doctorId,
      patientId,
      organizationId,
      branchId,
      createdAt: currentDate.toISOString(),
      isDeleted: false,
    };

    const { reason_visit, ...filteredPatientData } = patientData;

    const encryptedPatientData = encryptDocument(
      { ...basePatientData, ...filteredPatientData },
      [
        "doctorId",
        "patientId",
        "organizationId",
        "branchId",
        "isDeleted",
        "createdAt",
      ]
    );

    const branchRef = branchCollection.doc(branchId);
    await branchRef.update({
      patients: admin.firestore.FieldValue.arrayUnion(patientId),
    });

    const patientRef = patientCollection.doc(patientId);
    await patientRef.set(encryptedPatientData);

    await addVisit(patientId, doctorId, reason_visit);
    await pushNotification(doctorId, "newPatient", {
      branchId,
      doctorId,
      patientId,
    });
    return { id: patientId, createdAt: basePatientData.createdAt };
  } catch (error) {
    console.error("Error adding patient: ", error);
    throw error;
  }
};

const getPatients = async (
  organizationId,
  branchId,
  doctorId,
  role,
  firebaseUid
) => {
  try {
    const userRecord = await admin.auth().getUser(firebaseUid);
    if (!userRecord) {
      throw { status: 404, message: "User not found." };
    }

    let patientQuery;

    if (role === "0") {
      patientQuery = patientCollection.where(
        "organizationId",
        "==",
        organizationId
      );
    } else if (role === "1" || role === "3") {
      patientQuery = patientCollection.where("branchId", "==", branchId);
    } else if (role === "2") {
      if (!doctorId) {
        throw new Error("Doctor ID must be provided for doctor-level access.");
      }
      patientQuery = patientCollection
        .where("doctorId", "==", doctorId)
        .where("branchId", "==", branchId);
    } else {
      throw new Error("Invalid role provided.");
    }

    const patientSnapshot = await patientQuery.get();

    if (patientSnapshot.empty) {
      console.warn("No patients found, returning an empty array.");
      return [];
    }

    const patients = patientSnapshot.docs.map((patientDoc) => {
      const patientData = patientDoc.data();
      const decryptedPatientData = decryptDocument(patientData, [
        "patientId",
        "branchId",
        "doctorId",
        "organizationId",
        "createdAt",
        "isDeleted",
      ]);

      return decryptedPatientData;
    });

    return patients;
  } catch (error) {
    console.error("Error fetching patients:", error.message);
    throw new Error("Error fetching patients: " + error.message);
  }
};

const addVisit = async (patientId, doctorId, reason_visit) => {
  const currentDate = new Date();
  const visitId = uuidv4();

  const patientRef = patientCollection.doc(patientId);
  const visitSubColRef = patientRef.collection("visit").doc(visitId);
  const visitData = {
    visitId,
    date: currentDate.toISOString(),
    doctorId,
    reason_visit,
    patientId: patientId,
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

    const encryptValue = (value) => {
      if (typeof value === "string") {
        return encryptData(value);
      }
      return value;
    };

    const deepEncrypt = (data) => {
      const encryptedData = {};
      for (const [key, value] of Object.entries(data)) {
        if (
          typeof value === "object" &&
          value !== null &&
          !Array.isArray(value)
        ) {
          encryptedData[key] = deepEncrypt(value);
        } else {
          encryptedData[key] = encryptValue(value);
        }
      }
      return encryptedData;
    };

    const finalEncryptedData = deepEncrypt(noteDetails);

    await noteRef.set({
      noteId,
      ...finalEncryptedData,
      createdAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error adding note:", error);
    throw error;
  }
};

const getNote = async (patientId, visitId, firebaseUid) => {
  try {
    const userRecord = await admin.auth().getUser(firebaseUid);
    if (!userRecord) {
      throw { status: 404, message: "User not found." };
    }
    const noteRef = patientCollection
      .doc(patientId)
      .collection("notes")
      .doc(visitId);

    const noteData = await noteRef.get();

    if (!noteData.exists) {
      throw new Error("Note not found");
    }

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

    const deepDecrypt = (data) => {
      const decryptedData = {};
      for (const [key, value] of Object.entries(data)) {
        if (
          typeof value === "object" &&
          value !== null &&
          !Array.isArray(value)
        ) {
          decryptedData[key] = deepDecrypt(value);
        } else {
          decryptedData[key] = decryptValue(key, value);
        }
      }
      return decryptedData;
    };

    const finalDecryptedData = deepDecrypt(noteDetails);

    return finalDecryptedData;
  } catch (error) {
    if (error.code === "auth/user-not-found") {
      console.error("User not found:", error);
      throw {
        status: 404,
        message:
          "There is no user record corresponding to the provided identifier.",
      };
    }

    console.error("Error fetching note:", error);
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
  getPatients,
  updatePatientDetails,
  deletePatient,
  retrievePatient,
  addNote,
  getNote,
  // getPatientsByDoctor,
  // getPatients,
};
