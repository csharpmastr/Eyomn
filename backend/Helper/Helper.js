const admin = require("firebase-admin");
const { v4: uuidv4 } = require("uuid");
const {
  organizationCollection,
  patientCollection,
  staffCollection,
} = require("../Config/FirebaseConfig");
const { decryptData } = require("../Security/DataHashing");

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

const getPatients = async (staffId, branchId, role) => {
  try {
    if (!branchId || !role) {
      throw new Error("Branch ID and Role must be provided.");
    }

    let patientQuery;

    if (role === "1" || role === "3") {
      patientQuery = patientCollection.where("branchId", "==", branchId);
    } else if (role === "2") {
      if (!staffId) {
        throw new Error("Staff ID must be provided for role 2 (doctor).");
      }
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
      const decryptedPatientData = {};

      for (const [key, value] of Object.entries(patientData)) {
        if (
          key !== "patientId" &&
          key !== "branchId" &&
          key !== "doctorId" &&
          key !== "organizationId" &&
          key !== "createdAt" &&
          key !== "isDeleted"
        ) {
          decryptedPatientData[key] = decryptData(value);
        } else {
          decryptedPatientData[key] = value;
        }
      }

      return decryptedPatientData;
    });

    return patients;
  } catch (error) {
    console.error("Error fetching patients:", error.message);
    throw new Error("Error fetching patients: " + error.message);
  }
};

const getStaffs = async (organizationId, branchId) => {
  try {
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
      ]);
    });

    return staffs;
  } catch (error) {
    console.error("Error fetching staffs:", error.message);
    throw new Error("Error fetching staffs: " + error.message);
  }
};

const getBranchDoctors = async (organizationId, branchId) => {
  try {
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
      const { first_name, last_name, position, staffId } = doctorDoc.data();

      const decryptedFirstName = decryptData(first_name);
      const decryptedLastName = decryptData(last_name);
      const decryptedPosition = decryptData(position);

      return {
        first_name: decryptedFirstName,
        last_name: decryptedLastName,
        position: decryptedPosition,
        staffId,
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
const addVisit = async (patientId, doctorId) => {
  try {
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
    console.log(
      `Visit added for patient ${patientId} with visit ID: ${visitId}`
    );
  } catch (error) {
    console.error("Error adding visit:", error.message);
    throw new Error("Error adding visit: " + error.message);
  }
};
const getVisit = async (patientId, doctorId) => {
  try {
    let visitQuery = patientCollection.doc(patientId).collection("visit");

    if (doctorId) {
      visitQuery = visitQuery.where("doctorId", "==", doctorId);
    }

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

module.exports = {
  getOrganizationName,
  getPatients,
  decryptDocument,
  getStaffs,
  getBranchDoctors,
  addVisit,
  getVisit,
};
