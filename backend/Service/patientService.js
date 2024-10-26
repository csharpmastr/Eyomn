const admin = require("firebase-admin");
const { v4: uuidv4 } = require("uuid");
const { encryptData, decryptData } = require("../Security/DataHashing");
const {
  db,
  patientCollection,
  branchCollection,
  visitCollection,
  noteCollection,
} = require("../Config/FirebaseConfig");
const {
  encryptDocument,
  decryptDocument,
  generateUniqueId,
  removeNullValues,
} = require("../Helper/Helper");
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

    if (!organizationId || !branchId || !doctorId) {
      throw new Error(
        "Organization ID, Branch ID, and Doctor ID are required."
      );
    }

    const patientId = await generateUniqueId(patientCollection);

    const basePatientData = {
      patientId: patientId,
      doctorId,
      organizationId,
      branchId,
      createdAt: currentDate.toISOString(),
      isDeleted: false,
    };

    const { reason_visit, ...filteredPatientData } = patientData;
    const patientName = patientData.first_name + " " + patientData.last_name;
    const encryptedName = encryptData(patientName);
    const encryptedPatientData = encryptDocument(
      { ...basePatientData, ...filteredPatientData },
      [
        "patientId",
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

    await addVisit(patientId, doctorId, reason_visit, branchId, firebaseUid);

    return {
      id: patientId,
      createdAt: basePatientData.createdAt,
    };
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

const addVisit = async (
  patientId,
  doctorId,
  reason_visit,
  branchId,
  firebaseUid
) => {
  const currentDate = new Date();
  try {
    const userRecord = await admin.auth().getUser(firebaseUid);
    if (!userRecord) {
      throw { status: 404, message: "User not found." };
    }

    const visitId = await generateUniqueId(visitCollection);

    const visitData = {
      visitId,
      date: currentDate.toISOString(),
      doctorId,
      reason_visit,
      patientId,
      branchId: branchId,
    };

    const patientSnapshot = await patientCollection.doc(patientId).get();
    let patientName = "";
    let isReturningPatient = false;

    if (patientSnapshot.exists) {
      const patientData = patientSnapshot.data();
      const firstName = decryptData(patientData.first_name);
      const lastName = decryptData(patientData.last_name);
      patientName = `${firstName} ${lastName}`;

      const previousVisitsSnapshot = await visitCollection
        .where("patientId", "==", patientId)
        .get();

      isReturningPatient = !previousVisitsSnapshot.empty;
    } else {
      throw { status: 404, message: "Patient not found." };
    }

    const visitSubColRef = visitCollection.doc(visitId);
    await visitSubColRef.set(visitData);

    console.log(
      `Visit added for patient ${patientId} (${patientName}) with visit ID: ${visitId}`
    );

    const notificationType = isReturningPatient
      ? "returnPatient"
      : "newPatient";

    await pushNotification(doctorId, notificationType, {
      branchId,
      doctorId,
      patientId,
      patientName,
    });

    return { visitId, date: visitData.date };
  } catch (error) {
    console.error("Error adding visit: ", error);
    throw new Error("Failed to add visit: " + error.message);
  }
};

const addNote = async (patientId, noteDetails, firebaseUid) => {
  try {
    const userRecord = await admin.auth().getUser(firebaseUid);
    if (!userRecord) {
      throw { status: 404, message: "User not found." };
    }
    const noteId = await generateUniqueId(
      patientCollection.doc(patientId).collection("notes")
    );
    const noteCol = noteCollection.doc(patientId).collection("notes");
    const cleanedNote = removeNullValues(noteDetails);

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

    const finalEncryptedData = deepEncrypt(cleanedNote);
    const noteRef = noteCol.doc(noteId);
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

module.exports = {
  addPatient,
  getPatients,
  updatePatientDetails,
  deletePatient,
  retrievePatient,
  addNote,
  getNote,
  addVisit,
  // getPatientsByDoctor,
  // getPatients,
};
