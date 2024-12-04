const admin = require("firebase-admin");
require("dotenv").config();
const {
  getOrganizationName,
  decryptDocument,
  getStaffs,
  getBranchDoctors,
  getVisit,
  getPatients,
  getBranchName,
  verifyFirebaseUid,
  generateOTP,
  sendEmail,
} = require("../Helper/Helper");
const { v4: uuidv4 } = require("uuid");

const {
  organizationCollection,
  userCollection,
  branchCollection,
  staffCollection,
  patientCollection,
} = require("../Config/FirebaseConfig");
const {
  hashPassword,
  encryptData,
  comparePassword,
  decryptData,
} = require("../Security/DataHashing");

class EmailAlreadyExistsError extends Error {
  constructor(message) {
    super(message);
    this.name = "EmailAlreadyExistsError";
  }
}
const otpStore = {};

const storeOTP = (email) => {
  const otp = generateOTP();
  const expirationTime = Date.now() + 5 * 60 * 1000;

  otpStore[email] = { otp, expirationTime };

  return otp;
};

const addUser = async (orgData) => {
  try {
    const newUser = await admin.auth().createUser({
      email: orgData.email,
      password: orgData.password,
      displayName: `${orgData.organization}`,
    });
    const orgRef = organizationCollection;
    const userRef = userCollection;

    const q = orgRef.where("email", "==", orgData.email);
    const querySnapshot = await q.get();

    if (!querySnapshot.empty) {
      throw new EmailAlreadyExistsError("Email already exists.");
    }

    const hashedPassword = await hashPassword(orgData.password);
    const encryptedOrganization = encryptData(orgData.organization);
    const encryptedContact = encryptData(orgData.contact);

    const userId = uuidv4();

    const orgDocRef = orgRef.doc(userId);
    const userDocRef = userRef.doc(userId);

    await orgDocRef.set({
      firebaseUid: newUser.uid,
      email: orgData.email,
      branch: [],
      organization: encryptedOrganization,
      contact: encryptedContact,
      id: userId,
      role: "0",
    });

    await userDocRef.set({
      firebaseUid: newUser.uid,
      email: orgData.email,
      password: hashedPassword,
      id: userId,
      role: "0",
      isNew: true,
    });

    return { userId, organization: orgData.organization, role: "0" };
  } catch (error) {
    if (error instanceof EmailAlreadyExistsError) {
      throw error;
    }
    throw new Error("Failed to add user: " + error.message);
  }
};

const loginUser = async (userData) => {
  const { email, password } = userData;
  console.log(email, password);

  try {
    try {
      let firebaseUser;
      firebaseUser = await admin.auth().getUserByEmail(email);
      console.log("User exists in Firebase Auth:", firebaseUser.uid);
    } catch (firebaseError) {
      throw new Error("User not found in Firebase Authentication");
    }

    const userRef = userCollection.where("email", "==", email);
    const querySnapshot = await userRef.get();

    if (querySnapshot.empty) {
      throw new Error("Invalid email or password");
    }

    const user = querySnapshot.docs[0].data();
    const isPasswordValid = await comparePassword(password, user.password);

    if (!isPasswordValid) {
      throw new Error("Invalid email or password");
    }

    if (!user.role) {
      throw new Error("User role not found");
    }

    let data = null;
    if (user.role === "0") {
      const orgQuery = organizationCollection.where("id", "==", user.id);
      const orgSnapShot = await orgQuery.get();

      if (orgSnapShot.empty) {
        throw new Error("Organization data not found");
      }

      const organization = orgSnapShot.docs[0].data();
      const org = decryptData(organization.organization);
      const orgBranches = organization.branch;
      const orgFirebaseUid = organization.firebaseUid;

      const branches = [];

      data = {
        userId: user.id,
        role: user.role,
        organization: org,
        firebaseUid: orgFirebaseUid,
        isNew: user.isNew,
      };
    } else if (user.role === "1") {
      const branchQuery = branchCollection.where(
        "branchId",
        "==",
        user.branchId
      );
      const branchSnapShot = await branchQuery.get();

      if (branchSnapShot.empty) {
        throw new Error("Branch data not found");
      }

      const organization = await getOrganizationName(user.organizationId);
      const branchDataSnap = branchSnapShot.docs[0].data();
      const branchData = decryptDocument(branchDataSnap, [
        "email",
        "branchId",
        "staffs",
        "patients",
        "firebaseUid",
      ]);

      data = {
        role: user.role,
        userId: user.branchId,
        organizationId: user.organizationId,
        branchData,
        organization,
        firebaseUid: user.firebaseUid,
        isNew: user.isNew,
      };
      console.log("branch firebase Uid: ", user.firebaseUid);
    } else if (user.role === "2") {
      const staffQuery = staffCollection.where("staffId", "==", user.staffId);
      const staffSnapShot = await staffQuery.get();

      if (staffSnapShot.empty) {
        throw new Error("Staff data not found");
      }

      const staffEncryptedData = staffSnapShot.docs[0].data();
      const staffData = decryptDocument(staffEncryptedData, [
        "email",
        "branchId",
        "organizationId",
        "staffId",
        "role",
        "branches",
        "firebaseUid",
      ]);
      for (id in staffData.branches) {
      }
      for (const branch of staffData.branches) {
        const branchName = await getBranchName(branch.branchId);
        branch.branchName = branchName;
      }
      const organization = await getOrganizationName(user.organizationId);

      data = {
        role: user.role,
        userId: user.staffId,
        branchId: user.branchId,
        organizationId: user.organizationId,
        organization,
        staffData,
        isNew: user.isNew,
      };
    } else {
      const staffQuery = staffCollection.where("staffId", "==", user.staffId);
      const staffSnapShot = await staffQuery.get();

      if (staffSnapShot.empty) {
        throw new Error("Staff data not found");
      }

      const staffEncryptedData = staffSnapShot.docs[0].data();
      const staffData = decryptDocument(staffEncryptedData, [
        "email",
        "branchId",
        "organizationId",
        "staffId",
        "role",
        "branches",
        "firebaseUid",
      ]);

      const organization = await getOrganizationName(user.organizationId);

      data = {
        isNew: user.isNew,
        role: user.role,
        userId: user.staffId,
        branchId: user.branchId,
        organizationId: user.organizationId,
        organization,
        staffData,
      };
    }

    return data;
  } catch (error) {
    console.error("Login failed:", error.message);
    throw new Error("Login failed: " + error.message);
  }
};

const changeUserPassword = async (
  organizationId,
  branchId,
  staffId,
  role,
  firebaseUid,
  password,
  newPassword
) => {
  try {
    await verifyFirebaseUid(firebaseUid);
    let targetRef;
    console.log(
      organizationId,
      branchId,
      staffId,
      role,
      firebaseUid,
      password,
      newPassword
    );

    if (organizationId) {
      targetRef = userCollection.where("id", "==", organizationId);
    } else if (branchId) {
      targetRef = userCollection
        .where("branchId", "==", branchId)
        .where("role", "==", role);
    } else if (staffId) {
      targetRef = userCollection.where("staffId", "==", staffId);
    }

    const querySnapshot = await targetRef.get();

    if (querySnapshot.empty) {
      throw new Error("User not found.");
    }

    const userDoc = querySnapshot.docs[0];
    const userDocData = userDoc.data();

    const isPasswordValid = await comparePassword(
      password,
      userDocData.password
    );
    if (!isPasswordValid) {
      throw {
        status: 400,
        message: "Password does not match.",
      };
    }

    const hashedPassword = await hashPassword(newPassword);
    await userDoc.ref.update({
      password: hashedPassword,
    });

    console.log("Password updated successfully.");
  } catch (error) {
    console.error("Error updating password:", error.message);
    throw error;
  }
};
const sendOTP = async (email) => {
  try {
    const otp = storeOTP(email);

    await sendEmail({
      to: email,
      subject: "Your One-Time Password (OTP)",
      text: `Dear User,

We received a request to verify your identity. Please use the following One-Time Password (OTP) to complete the process:

OTP: ${otp}

This code is valid for the next 5 minutes and can only be used once. If you did not request this, please disregard this message or contact our support team immediately.

Best regards,  
Team Eyomn`,
    });
  } catch (error) {
    console.error("Failed to send OTP:", error);
  }
};

const verifyOTP = (email, otpEntered) => {
  const otpRecord = otpStore[email];

  if (!otpRecord) {
    return "OTP not found.";
  }

  const { otp, expirationTime } = otpRecord;

  if (Date.now() > expirationTime) {
    delete otpStore[email];
    return "OTP has expired.";
  }

  if (otp === otpEntered) {
    delete otpStore[email];
    return true;
  } else {
    return false;
  }
};
const forgotChangePassword = async (email, newPassword) => {
  try {
    const userRef = userCollection.where("email", "==", email);

    const userSnapshot = await userRef.get();

    if (userSnapshot.empty) {
      throw { status: 400, message: "There is no existing email." };
    }

    const userDoc = userSnapshot.docs[0];
    const hashedPassword = await hashPassword(newPassword);

    await userDoc.ref.update({
      password: hashedPassword,
    });

    console.log("Password updated successfully!");
  } catch (error) {
    console.error("Error updating password: ", error);
  }
};

module.exports = {
  addUser,
  loginUser,
  EmailAlreadyExistsError,
  changeUserPassword,
  sendOTP,
  verifyOTP,
  forgotChangePassword,
};
