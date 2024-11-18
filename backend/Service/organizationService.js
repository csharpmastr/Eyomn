const admin = require("firebase-admin");
const nodemailer = require("nodemailer");
const {
  db,
  userCollection,
  branchCollection,
  organizationCollection,
  staffCollection,
  inventoryCollection,
} = require("../Config/FirebaseConfig");
const { v4: uuidv4 } = require("uuid");
const {
  encryptData,
  hashPassword,
  decryptData,
} = require("../Security/DataHashing");
const { EmailAlreadyExistsError } = require("./userService");
const {
  getStaffs,
  getPatients,
  decryptDocument,
  verifyFirebaseUid,
  generateUniqueId,
  generatePassword,
  sendEmail,
  getOrganizationName,
} = require("../Helper/Helper");
const { getAppointments } = require("./appointmentService");

const addStaff = async (organizationId, staffData, firebaseUid) => {
  try {
    await verifyFirebaseUid(firebaseUid);
    const emailQuery = await userCollection
      .where("email", "==", staffData.email)
      .get();

    if (!emailQuery.empty) {
      throw { status: 400, message: "Email already exists." };
    }
    const password = generatePassword();
    console.log(password);
    const hashedPassword = await hashPassword(password);
    console.log(hashedPassword);
    const orgName = await getOrganizationName(organizationId);

    const newUser = await admin.auth().createUser({
      email: staffData.email,
      password: password,
      displayName: `${staffData.firstName} ${staffData.lastName}`,
    });

    const staffId = await generateUniqueId(staffCollection);

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
      password: hashedPassword,
    };

    for (const [key, value] of Object.entries(staffData)) {
      if (key === "email") {
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
    await sendEmail({
      to: staffData.email,
      subject: "Your New Account Credentials",
      text: `Hello ${staffData.first_name},

      Your account has been successfully created. Here are your login credentials:
      
      Email: ${staffData.email}
      Password: ${password}
      
      Please log in and change your password after your first login.
      
      Best regards,
      ${orgName}`,
    });

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

const addBranch = async (organizationId, branchData, firebaseUid) => {
  try {
    await verifyFirebaseUid(firebaseUid);

    const newUser = await admin.auth().createUser({
      email: branchData.email,
      password: branchData.password,
      displayName: `${branchData.name}`,
    });
    const branchId = await generateUniqueId(branchCollection);
    const password = generatePassword();
    const hashedPassword = await hashPassword(password);
    const orgName = getOrganizationName(organizationId);
    const encryptedBranchData = {
      branchId: branchId,
      firebaseUid: newUser.uid,
      patients: [],
      staffs: [],
    };
    const encryptedBranchCredentials = {
      email: branchData.email,
      firebaseUid: newUser.uid,
      organizationId: organizationId,
      role: "1",
      branchId: branchId,
      password: hashedPassword,
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
      if (key === "email" || key === "clinicId") {
        encryptedBranchData[key] = value;
      } else {
        encryptedBranchData[key] = encryptData(value);
      }
    }
    await sendEmail({
      to: branchData.email,
      subject: "Your New Account Credentials",
      text: `Hello ${branchData.name},

      Your account has been successfully created. Here are your login credentials:
      
      Email: ${branchData.email}
      Password: ${password}
      
      Please log in and change your password after your first login.
      
      Best regards,
      ${orgName}`,
    });

    const userRef = userCollection.doc(branchId);
    const branchRef = branchCollection.doc(branchId);
    const orgRef = organizationCollection.doc(organizationId);

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
    await verifyFirebaseUid(firebaseUid);

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

const getBranchStaffs = async (organizationId, branchId, firebaseUid) => {
  try {
    await verifyFirebaseUid(firebaseUid);

    const staffQuery = staffCollection.where(
      "organizationId",
      "==",
      organizationId
    );

    const staffSnapshot = await staffQuery.get();
    if (staffSnapshot.empty) {
      console.warn("No staffs found, returning an empty array.");
      return [];
    }

    const staffs = staffSnapshot.docs
      .filter((staffDoc) => {
        const { branches } = staffDoc.data();
        return branches.some((branch) => branch.branchId === branchId);
      })
      .map((staffDoc) => {
        const staffData = staffDoc.data();
        return decryptDocument(staffData, [
          "organizationId",
          "staffId",
          "role",
          "email",
          "branches",
          "firebaseUid",
        ]);
      });

    return staffs;
  } catch (error) {
    console.error("Error fetching branch staffs:", error.message);
    throw new Error("Error fetching branch staffs: " + error.message);
  }
};

const getBranchNameDoc = async (staffId) => {
  try {
    const staffRef = staffCollection.doc(staffId);
    const staffSnapshot = await staffRef.get();

    if (!staffSnapshot.exists) {
      throw new Error("Staff not found");
    }
    const staffData = staffSnapshot.data();
    const branches = staffData.branches;

    let decryptedBranchName = [];

    for (const branch of branches) {
      const branchRef = branchCollection.doc(branch.branchId);
      const branchSnap = await branchRef.get();

      if (!branchSnap.exists) {
        throw new Error("Branch not found");
      }

      const branchData = branchSnap.data();
      decryptedBranchName.push({
        branchName: decryptData(branchData.name),
        branchId: branch.branchId,
      });
    }
    return decryptedBranchName;
  } catch (error) {
    console.error("Error fetching branch name: ", error);
    throw error;
  }
};

module.exports = {
  addStaff,
  getBranchData,
  // getAllStaff,
  // getDoctorsList,
  addBranch,
  getBranchNameDoc,
  getBranchStaffs,
};
