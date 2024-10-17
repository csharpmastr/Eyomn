const admin = require("firebase-admin");
const { v4: uuidv4 } = require("uuid");
const {
  organizationCollection,
  patientCollection,
  staffCollection,
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
    let staffQuery;

    if (branchId) {
      staffQuery = staffCollection
        .where("organizationId", "==", organizationId)
        .where("branchId", "==", branchId);
    } else {
      console.warn("Branch ID is not defined, returning an empty array.");
      return [];
    }

    const staffSnapshot = await staffQuery.get();

    if (staffSnapshot.empty) {
      console.warn(
        "No staff found for the specified organization and branch, returning an empty array."
      );
      return [];
    }

    const staffs = staffSnapshot.docs.map((staffDoc) => {
      const staffData = staffDoc.data();
      return decryptDocument(staffData, [
        "organizationId",
        "staffId",
        "branchId",
        "role",
        "email",
        "schedule",
        "firebaseUid",
      ]);
    });

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
      .where("branchId", "==", branchId)
      .where("role", "==", "2");

    const doctorSnapShot = await doctorQuery.get();
    if (doctorSnapShot.empty) {
      console.warn("No staff found, returning an empty array.");
      return [];
    }
    const doctors = doctorSnapShot.docs.map((doctorDoc) => {
      const { first_name, last_name, position, staffId, schedule } =
        doctorDoc.data();

      const decryptedFirstName = decryptData(first_name);
      const decryptedLastName = decryptData(last_name);
      const decryptedPosition = decryptData(position);

      return {
        first_name: decryptedFirstName,
        last_name: decryptedLastName,
        position: decryptedPosition,
        staffId,
        schedule,
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
    let visitQuery = patientCollection.doc(patientId).collection("visit");

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
  return Object.fromEntries(
    Object.entries(obj).filter(([key, value]) => value !== null && value !== "")
  );
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
};
