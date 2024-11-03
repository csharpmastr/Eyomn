const admin = require("firebase-admin");
const { v4: uuid } = require("uuid");
const {
  organizationCollection,
  patientCollection,
  staffCollection,
  visitCollection,
  branchCollection,
} = require("../Config/FirebaseConfig");
const { decryptData, encryptData } = require("../Security/DataHashing");

const getOrganizationName = async (organizationId) => {
  try {
    const orgRef = organizationCollection.doc(organizationId);
    const orgSnap = await orgRef.get();

    if (!orgSnap.exists) {
      throw new Error("Organization not found");
    }
    const orgData = orgSnap.data();
    const organizationName = decryptData(orgData.organization);

    return organizationName;
  } catch (error) {
    console.error("Error fetching organization name:", error.message);
    throw new Error("Error fetching organization name: " + error.message);
  }
};

const getPatients = async (
  organizationId,
  staffId,
  branchId,
  role,
  firebaseUid
) => {
  try {
    const userRecord = await admin.auth().getUser(firebaseUid);
    if (!userRecord) {
      throw { status: 404, message: "User not found." };
    }
    if (!branchId || !role) {
      throw new Error("Branch ID and Role must be provided.");
    }

    let patientQuery;
    if (role === "0") {
      patientQuery = patientCollection
        .where("organizationId", "==", organizationId)
        .where("branchId", "==", branchId);
    } else if (role === "1" || role === "3") {
      patientQuery = patientCollection.where("branchId", "==", branchId);
    } else if (role === "2") {
      patientQuery = patientCollection
        .where("doctorId", "==", staffId)
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
    if (error.code === "auth/user-not-found") {
      console.error("User not found:", error);
      throw {
        status: 404,
        message:
          "There is no user record corresponding to the provided identifier.",
      };
    }

    console.error("Error fetching patients:", error);
    throw error;
  }
};

const getStaffs = async (organizationId, branchId, firebaseUid) => {
  try {
    const userRecord = await admin.auth().getUser(firebaseUid);
    if (!userRecord) {
      throw { status: 404, message: "User not found." };
    }

    const staffQuery = staffCollection.where(
      "organizationId",
      "==",
      organizationId
    );
    const staffSnapshot = await staffQuery.get();

    if (staffSnapshot.empty) {
      console.warn(
        "No staff found for the specified organization, returning an empty array."
      );
      return [];
    }

    const staffs = staffSnapshot.docs
      .map((staffDoc) => {
        const staffData = staffDoc.data();

        const hasBranch = staffData.branches.some(
          (branch) => branch.branchId === branchId
        );

        if (hasBranch) {
          return decryptDocument(staffData, [
            "organizationId",
            "staffId",
            "role",
            "email",
            "branches",
            "firebaseUid",
          ]);
        }
        return null;
      })
      .filter((staff) => staff !== null);

    return staffs;
  } catch (error) {
    console.error("Error fetching staffs:", error.message);
    throw new Error("Error fetching staffs: " + error.message);
  }
};

const getBranchDoctors = async (organizationId, branchId, firebaseUid) => {
  try {
    const userRecord = await admin.auth().getUser(firebaseUid);
    if (!userRecord) {
      throw { status: 404, message: "User not found." };
    }

    const doctorQuery = staffCollection
      .where("organizationId", "==", organizationId)
      .where("role", "==", "2");

    const doctorSnapShot = await doctorQuery.get();
    if (doctorSnapShot.empty) {
      console.warn("No doctors found, returning an empty array.");
      return [];
    }

    const doctors = doctorSnapShot.docs
      .filter((doctorDoc) => {
        const { branches } = doctorDoc.data();
        return branches.some((branch) => branch.branchId === branchId);
      })
      .map((doctorDoc) => {
        const { first_name, last_name, position, staffId, branches } =
          doctorDoc.data();
        const branchInfo = branches.find(
          (branch) => branch.branchId === branchId
        );

        const decryptedFirstName = decryptData(first_name);
        const decryptedLastName = decryptData(last_name);
        const decryptedPosition = decryptData(position);

        return {
          first_name: decryptedFirstName,
          last_name: decryptedLastName,
          position: decryptedPosition,
          staffId,
          schedule: branchInfo ? branchInfo.schedule : [],
        };
      });

    return doctors;
  } catch (error) {
    console.error("Error fetching doctors:", error.message);
    throw new Error("Error fetching doctors: " + error.message);
  }
};

function decryptDocument(data, excludedKeys) {
  const decryptedData = {};
  for (const key in data) {
    if (!excludedKeys.includes(key)) {
      decryptedData[key] = decryptData(data[key]);
    } else {
      decryptedData[key] = data[key];
    }
  }
  return decryptedData;
}
function encryptDocument(data, excludedKeys) {
  const encryptedData = {};
  for (const key in data) {
    if (!excludedKeys.includes(key)) {
      encryptedData[key] = encryptData(data[key]);
    } else {
      encryptedData[key] = data[key];
    }
  }
  return encryptedData;
}

const getVisits = async (patientId, firebaseUid) => {
  try {
    const userRecord = await admin.auth().getUser(firebaseUid);
    if (!userRecord) {
      throw { status: 404, message: "User not found." };
    }
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

const removeNullValues = (obj) => {
  if (typeof obj !== "object" || obj === null) {
    return obj;
  }

  return Object.fromEntries(
    Object.entries(obj)
      .map(([key, value]) => [key, removeNullValues(value)])
      .filter(
        ([key, value]) =>
          value !== null &&
          value !== "" &&
          !(typeof value === "object" && Object.keys(value).length === 0)
      )
  );
};
const checkIfDocExists = async (collectionRef, docId) => {
  const docRef = collectionRef.doc(docId);
  const docSnapshot = await docRef.get();

  if (docSnapshot.exists) {
    return true;
  } else {
    return false;
  }
};

const generateUniqueId = async (ref) => {
  let id;
  let idExists = true;

  while (idExists) {
    id = uuid();
    idExists = await checkIfDocExists(ref, id);
  }
  return id;
};

const getBranchName = async (branchId) => {
  try {
    const branchRef = branchCollection.doc(branchId);
    const branchSnap = await branchRef.get();

    if (!branchSnap.exists) {
      throw new Error("Branch not found");
    }

    const branchData = branchSnap.data();
    const decryptedBranchName = decryptData(branchData.name);
    return decryptedBranchName;
  } catch (error) {
    console.error("Error fetching branch name: ", error);
    throw error;
  }
};

const verifyFirebaseUid = async (firebaseUid) => {
  try {
    const userRecord = await admin.auth().getUser(firebaseUid);
    if (!userRecord) {
      throw { status: 404, message: "User not found." };
    }
    return userRecord;
  } catch (error) {
    if (error.code === "auth/user-not-found") {
      throw { status: 404, message: "User not found." };
    } else {
      throw {
        status: 500,
        message: "Failed to verify Firebase UID.",
        details: error,
      };
    }
  }
};

module.exports = {
  getOrganizationName,
  getPatients,
  decryptDocument,
  encryptDocument,
  getStaffs,
  getBranchDoctors,
  getVisits,
  removeNullValues,
  checkIfDocExists,
  generateUniqueId,
  getBranchName,
  verifyFirebaseUid,
};
