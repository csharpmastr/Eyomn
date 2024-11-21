const admin = require("firebase-admin");
const { v4: uuidv4 } = require("uuid");
const axios = require("axios");
const { encryptData, decryptData } = require("../Security/DataHashing");
const {
  db,
  patientCollection,
  branchCollection,
  visitCollection,
  noteCollection,
  bucket,
  staffCollection,
  inventoryCollection,
} = require("../Config/FirebaseConfig");
const {
  encryptDocument,
  decryptDocument,
  generateUniqueId,
  removeNullValues,
  verifyFirebaseUid,
  deepDecrypt,
  extractSoapData,
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
    await verifyFirebaseUid(firebaseUid);

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
    await verifyFirebaseUid(firebaseUid);

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
        "authorizedDoctor",
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
    await verifyFirebaseUid(firebaseUid);

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

const addRawNote = async (patientId, noteDetails, firebaseUid) => {
  try {
    await verifyFirebaseUid(firebaseUid);
    const noteId = await generateUniqueId(
      noteCollection.doc(patientId).collection("rawNotes")
    );
    const noteCol = noteCollection.doc(patientId).collection("rawNotes");
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
    const createdAt = new Date().toISOString();
    const finalEncryptedData = deepEncrypt(cleanedNote);
    const noteRef = noteCol.doc(noteId);
    await noteRef.set({
      noteId,
      ...finalEncryptedData,
      createdAt: createdAt,
    });
    return { noteId, createdAt };
  } catch (error) {
    console.error("Error adding note:", error);
    throw error;
  }
};

const getNotes = async (patientId, firebaseUid) => {
  try {
    await verifyFirebaseUid(firebaseUid);

    const noteRef = noteCollection.doc(patientId).collection("rawNotes");
    const soapRef = noteCollection.doc(patientId).collection("soapNotes");

    const noteSnapshot = await noteRef.get();
    const soapSnapshot = await soapRef.get();

    const finalRawNotes = noteSnapshot.empty
      ? []
      : noteSnapshot.docs.map((doc) => {
          const noteDetails = doc.data();
          return deepDecrypt(noteDetails);
        });

    const finalSoapNotes = soapSnapshot.empty
      ? []
      : soapSnapshot.docs.map((doc) => {
          const soapDetails = doc.data();

          const decryptedSoap = {
            noteId: soapDetails.noteId,
            subjective: soapDetails.subjective
              ? soapDetails.subjective.map((item) => decryptData(item))
              : [],
            objective: soapDetails.objective
              ? soapDetails.objective.map((item) => decryptData(item))
              : [],
            assessment: soapDetails.assessment
              ? soapDetails.assessment.map((sentence) => decryptData(sentence))
              : [],
            plan: soapDetails.plan
              ? soapDetails.plan.map((item) => decryptData(item))
              : [],
          };

          return decryptedSoap;
        });

    return {
      rawNotes: finalRawNotes,
      soapNotes: finalSoapNotes,
    };
  } catch (error) {
    if (error.code === "auth/user-not-found") {
      console.error("User not found:", error);
      throw {
        status: 404,
        message:
          "There is no user record corresponding to the provided identifier.",
      };
    }

    console.error("Error fetching notes:", error);
    throw error;
  }
};

const updatePatientDetails = async (patientId, patientData, firebaseUid) => {
  try {
    console.log(patientData);

    await verifyFirebaseUid(firebaseUid);
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

const getVisits = async (patientId, firebaseUid) => {
  try {
    await verifyFirebaseUid(firebaseUid);
    let visitQuery = visitCollection.where("patientId", "==", patientId);

    const visitSnapshot = await visitQuery.get();

    if (visitSnapshot.empty) {
      console.warn("No visits found for the patient.");
      return [];
    }

    const visits = visitSnapshot.docs.map((visitDoc) => visitDoc.data());

    return visits;
  } catch (error) {
    console.error("Error fetching visits:", error.message);
    throw new Error("Error fetching visits: " + error.message);
  }
};
const addImageArchive = async (imageFile, patientId, firebaseUid) => {
  try {
    await verifyFirebaseUid(firebaseUid);

    const filePath = `patients/${patientId}/${Date.now()}_${
      imageFile.originalname
    }`;

    const file = bucket.file(filePath);

    await file.save(imageFile.buffer, {
      metadata: { contentType: imageFile.mimetype },
      public: true,
    });
    await file.makePublic();
    const fileUrl = `https://storage.googleapis.com/${bucket.name}/${filePath}`;
    return fileUrl;
  } catch (error) {
    console.log("Error in addImageArchive:", error);
    throw error;
  }
};

const getImagesForPatient = async (patientId, firebaseUid) => {
  try {
    await verifyFirebaseUid(firebaseUid);

    const [files] = await bucket.getFiles({ prefix: `patients/${patientId}/` });

    if (files.length === 0) {
      return [];
    }
    const imageUrls = await Promise.all(
      files.map(async (file) => {
        const [url] = await file.getSignedUrl({
          action: "read",
          expires: "03-09-2491",
        });
        return url;
      })
    );

    return imageUrls;
  } catch (error) {
    throw new Error(`Error fetching images: ${error.message}`);
  }
};
const getDoctorPatient = async (organizationId, doctorId, firebaseUid) => {
  try {
    await verifyFirebaseUid(firebaseUid);

    const doctorSnapshot = await staffCollection.doc(doctorId).get();
    if (!doctorSnapshot.exists) {
      throw new Error("Doctor not found");
    }

    const doctorData = doctorSnapshot.data();
    const branches = doctorData.branches;

    const allBranchPatients = await Promise.all(
      branches.map(async (branch) => {
        const branchId = branch.branchId;
        return await getPatients(
          organizationId,
          branchId,
          doctorId,
          doctorData.role,
          firebaseUid
        );
      })
    );

    const branchPatients = allBranchPatients.flat();

    const authorizedDoctorPatients = await getPatientsWithAuthorizedDoctor(
      doctorId
    );

    const allPatients = [...branchPatients, ...authorizedDoctorPatients];

    const uniquePatients = Array.from(
      new Map(
        allPatients.map((patient) => [patient.patientId, patient])
      ).values()
    );

    return uniquePatients;
  } catch (error) {
    console.error(
      "Error fetching doctor patients with authorized doctors:",
      error
    );
    throw error;
  }
};

const sharePatient = async (
  authorizedDoctor,
  doctorId,
  patientId,
  firebaseUid
) => {
  try {
    await verifyFirebaseUid(firebaseUid);

    const patientRef = patientCollection.doc(patientId);
    const patientSnapshot = await patientCollection.doc(patientId).get();
    const doctorSnapshot = await staffCollection.doc(doctorId).get();

    let doctorName = "";
    let patientName = "";

    if (patientSnapshot.exists) {
      const patientData = patientSnapshot.data();
      const firstName = decryptData(patientData.first_name);
      const lastName = decryptData(patientData.last_name);
      patientName = `${firstName} ${lastName}`;
    }

    if (doctorSnapshot.exists) {
      const doctorData = doctorSnapshot.data();
      const firstName = decryptData(doctorData.first_name);
      const lastName = decryptData(doctorData.last_name);
      doctorName = `${firstName} ${lastName}`;
    }

    await patientRef.set({ authorizedDoctor }, { merge: true });

    for (const authorizedDoctorId of authorizedDoctor) {
      await pushNotification(authorizedDoctorId, "sharedPatient", {
        doctorId: authorizedDoctorId,
        patientId,
        doctorName,
        patientName,
      });
    }
  } catch (error) {
    console.error("Error sharing patient:", error.message);
    throw error; // Rethrow to be caught in the handler
  }
};
const getPatientsWithAuthorizedDoctor = async (doctorId) => {
  try {
    const patientsSnapshot = await patientCollection
      .where("authorizedDoctor", "array-contains", doctorId)
      .get();

    const patients = patientsSnapshot.docs.map((doc) => {
      const patientData = doc.data();

      const decryptedPatientData = decryptDocument(patientData, [
        "patientId",
        "branchId",
        "doctorId",
        "organizationId",
        "createdAt",
        "isDeleted",
        "authorizedDoctor",
      ]);

      return decryptedPatientData;
    });

    return patients;
  } catch (error) {
    console.error("Error fetching patients with authorized doctor:", error);
    throw error;
  }
};
const generateSoap = async (soapString, patientId, doctorId, firebaseUid) => {
  try {
    const currentDate = new Date();
    await verifyFirebaseUid(firebaseUid);
    console.log({ soapString });

    const soapNoteRef = noteCollection.doc(patientId).collection("soapNotes");
    const patientProfile = await patientCollection.doc(patientId).get();
    const soapId = await generateUniqueId(soapNoteRef);
    // const dictSoap = extractSoapData(soapString);

    // const encryptedSoap = Object.fromEntries(
    //   Object.entries(dictSoap).map(([key, value]) => [
    //     key,
    //     Array.isArray(value) ? value.map((item) => encryptData(item)) : value,
    //   ])
    // );

    const soapGenerator =
      "https://csharpmastr--eyomnai-medical-team-agent-web-endpoint.modal.run";

    const data = {
      patient_data: soapString,
      summarized_data: {
        subjective: "",
        objective: "",
        assessment: "",
        plan: "",
      },
      halu_score: Number(10),
      feedback: [],
      markdown_output: "",
    };
    const response = await axios.post(soapGenerator, data);

    const dictSoap = extractSoapData(response.data);
    console.log(response.data);
    const encrypytedSoap = {
      subjective: dictSoap.subjective.map((item) => encryptData(item)),
      objective: dictSoap.objective.map((item) => encryptData(item)),
      assessment: dictSoap.assessment.map((item) => encryptData(item)),
      plan: dictSoap.plan.map((item) => encryptData(item)),
      createdAt: currentDate.toISOString(),
      noteId: soapId,
    };

    await soapNoteRef.doc(soapId).set(encrypytedSoap);

    if (patientProfile.exists) {
      const patientData = patientProfile.data();
      const firstName = decryptData(patientData.first_name);
      const lastName = decryptData(patientData.last_name);
      const patientName = `${firstName} ${lastName}`;

      const notificationData = {
        patientName: patientName,
        patientId: patientId,
        doctorId: doctorId,
      };
      await pushNotification(doctorId, "soapNote", notificationData);
      console.log(
        `Notification sent to Doctor ${doctorId} for patient ${patientName}`
      );
    } else {
      console.error("Patient profile not found.");
    }

    return soapId;
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  addPatient,
  getPatients,
  updatePatientDetails,
  deletePatient,
  retrievePatient,
  addRawNote,
  getNotes,
  addVisit,
  getVisits,
  addImageArchive,
  getImagesForPatient,
  // getPatientsByDoctor,
  // getPatients,
  getDoctorPatient,
  sharePatient,
  generateSoap,
};
