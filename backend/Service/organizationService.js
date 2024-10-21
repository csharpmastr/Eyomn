const admin = require("firebase-admin");
const {
  db,
  userCollection,
  branchCollection,
  organizationCollection,
  staffCollection,
} = require("../Config/FirebaseConfig");
const { v4: uuidv4 } = require("uuid");
const {
  encryptData,
  hashPassword,
  decryptData,
} = require("../Security/DataHashing");
const { EmailAlreadyExistsError } = require("./UserService");
const { getStaffs, getPatients, decryptDocument } = require("../Helper/Helper");
const { getAppointments } = require("./appointmentService");

const addStaff = async (organizationId, staffData, firebaseUid) => {
  try {
    const userRecord = await admin.auth().getUser(firebaseUid);
    if (!userRecord) {
      throw { status: 404, message: "User not found." };
    }
    const emailQuery = await userCollection
      .where("email", "==", staffData.email)
      .get();

    if (!emailQuery.empty) {
      throw { status: 400, message: "Email already exists." };
    }

    const newUser = await admin.auth().createUser({
      email: staffData.email,
      password: staffData.password,
      displayName: `${staffData.firstName} ${staffData.lastName}`,
    });

    const staffId = uuidv4();
    const encryptedStaffData = {
      staffId,
      organizationId,
      firebaseUid: newUser.uid,
      branches: staffData.branches,
    };
    const staffCredentials = {
      staffId,
      email: staffData.email,
      organizationId,
      firebaseUid: newUser.uid,
    };

    for (const [key, value] of Object.entries(staffData)) {
      if (key === "password") {
        staffCredentials.password = await hashPassword(value);
      } else if (key === "email") {
        encryptedStaffData.email = value;
      } else if (key === "branches") {
        encryptedStaffData.branches = value;
      } else {
        encryptedStaffData[key] = encryptData(value);
      }
    }

    if (
      staffData.position === "Ophthalmologist" ||
      staffData.position === "Optometrist"
    ) {
      encryptedStaffData.role = "2";
      staffCredentials.role = "2";
    } else if (staffData.position === "Staff") {
      encryptedStaffData.role = "3";
      staffCredentials.role = "3";
    }

    const userRef = userCollection.doc(staffId);
    const staffRef = staffCollection.doc(staffId);

    await userRef.set(staffCredentials);
    await staffRef.set(encryptedStaffData);

    for (const branch of staffData.branches) {
      const branchRef = branchCollection.doc(branch.branchId);
      await branchRef.update({
        staffs: admin.firestore.FieldValue.arrayUnion(staffId),
      });
    }

    return staffId;
  } catch (err) {
    console.error("Error adding staff: ", err);
    throw err;
  }
};

const addBranch = async (ogrId, branchData, firebaseUid) => {
  try {
    const userRecord = await admin.auth().getUser(firebaseUid);
    if (!userRecord) {
      throw { status: 404, message: "User not found." };
    }

    const newUser = await admin.auth().createUser({
      email: branchData.email,
      password: branchData.password,
      displayName: `${branchData.name}`,
    });
    const branchId = uuidv4();
    const encryptedBranchData = {
      branchId: branchId,
      firebaseUid: newUser.uid,
      patients: [],
      staffs: [],
    };
    const encryptedBranchCredentials = {
      email: branchData.email,
      firebaseUid: newUser.uid,
      organizationId: ogrId,
      role: "1",
      branchId: branchId,
    };

    const branchQuerySnapshot = await branchCollection
      .where("email", "==", branchData.email)
      .get();
    if (!branchQuerySnapshot.empty) {
      throw new EmailAlreadyExistsError("Email already in use.");
    }
    const branchNameQuerySnapshot = await branchCollection
      .where("name", "==", branchData.name)
      .get();

    if (!branchNameQuerySnapshot.empty) {
      throw new Error("Branch name already exists.");
    }

    for (const [key, value] of Object.entries(branchData)) {
      if (key === "password") {
        encryptedBranchCredentials["password"] = await hashPassword(value);
      } else if (key === "email" || key === "clinicId") {
        encryptedBranchData[key] = value;
      } else {
        encryptedBranchData[key] = encryptData(value);
      }
    }

    const userRef = userCollection.doc(branchId);
    const branchRef = branchCollection.doc(branchId);
    const orgRef = organizationCollection.doc(ogrId);

    await orgRef.update({
      branch: admin.firestore.FieldValue.arrayUnion(branchId),
    });

    await branchRef.set(encryptedBranchData);
    await userRef.set(encryptedBranchCredentials);

    return branchId;
  } catch (err) {
    console.error("Error adding branch:", err);
    throw err;
  }
};

// const getAllStaff = async (clinicId) => {
//   try {
//     const clinicStaffRef = doc(db, "clinicStaff", clinicId);
//     const staffCollectionRef = collection(clinicStaffRef, "Staff");
//     const querySnapshot = await getDocs(staffCollectionRef);

//     if (querySnapshot.empty) {
//       return [];
//     }

//     const staffsData = querySnapshot.docs.map((doc) => {
//       const data = doc.data();
//       const decryptedData = {};

//       for (const [key, value] of Object.entries(data)) {
//         if (key === "role" || key === "staffId" || key === "email") {
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

//     return staffsData;
//   } catch (err) {
//     console.error("Error retrieving staff: ", err);
//     throw err;
//   }
// };

// const getDoctorsList = async (clinicId) => {
//   try {
//     const clinicStaffRef = doc(db, "clinicStaff", clinicId);
//     const staffCollectionRef = collection(clinicStaffRef, "Staff");

//     const querySnapshot = await getDocs(staffCollectionRef);
//     const doctorNames = [];
//     querySnapshot.forEach((doc) => {
//       const staffData = doc.data();

//       const decryptedPosition = decryptData(staffData.position);
//       const decryptedName = decryptData(staffData.name);
//       if (
//         decryptedPosition === "Optometrist" ||
//         decryptedPosition === "Ophthalmologist"
//       ) {
//         doctorNames.push({
//           id: doc.id,
//           name: decryptedName,
//           position: decryptedPosition,
//         });
//       }
//     });

//     return doctorNames;
//   } catch (error) {
//     console.error("Error fetching doctor list:", error);
//     throw error;
//   }
// };
const getBranchData = async (organizationId, firebaseUid) => {
  try {
    const userRecord = await admin.auth().getUser(firebaseUid);
    if (!userRecord) {
      throw { status: 404, message: "User not found." };
    }

    const orgRef = await organizationCollection.doc(organizationId).get();

    if (!orgRef.exists) {
      console.error("No such organization found!");
      return null;
    }

    const orgData = orgRef.data();
    const orgBranches = orgData.branch;
    console.log(orgData);

    const branches = [];

    const branchPromises = orgBranches.map(async (branchId) => {
      const branchRef = branchCollection.doc(branchId);
      const branchSnap = await branchRef.get();

      if (branchSnap.exists) {
        const branchData = branchSnap.data();
        const decryptedBranchData = decryptDocument(branchData, [
          "email",
          "patients",
          "staffs",
          "branchId",
          "firebaseUid",
        ]);

        const [staffs, appointments] = await Promise.all([
          getStaffs(orgData.id, branchId, firebaseUid),
          getAppointments(branchId, null, firebaseUid, false),
        ]);

        decryptedBranchData.staffs = staffs;
        decryptedBranchData.appointments = appointments;

        return decryptedBranchData;
      }
    });

    const branchData = await Promise.all(branchPromises);
    return branchData.filter(Boolean);
  } catch (error) {
    console.error("Error fetching branch data:", error);
    return null;
  }
};

module.exports = {
  addStaff,
  getBranchData,
  // getAllStaff,
  // getDoctorsList,
  addBranch,
};
