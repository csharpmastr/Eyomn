const admin = require("firebase-admin");
require("dotenv").config();
const {
  getOrganizationName,
  decryptDocument,
  getStaffs,
  getBranchDoctors,
  getVisit,
  getPatients,
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
const { getAppointment } = require("./appointmentService");

class EmailAlreadyExistsError extends Error {
  constructor(message) {
    super(message);
    this.name = "EmailAlreadyExistsError";
  }
}
const addUser = async (orgData) => {
  try {
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
      email: orgData.email,
      branch: [],
      organization: encryptedOrganization,
      contact: encryptedContact,
      id: userId,
      role: "0",
    });

    await userDocRef.set({
      email: orgData.email,
      password: hashedPassword,
      id: userId,
      role: "0",
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
  try {
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

      console.log("Branch IDs in organization:", orgBranches);

      const branches = [];

      for (const branchId of orgBranches) {
        const branchRef = branchCollection.doc(branchId);
        const branchSnap = await branchRef.get();

        if (branchSnap.exists) {
          const branchData = branchSnap.data();
          const decryptedBranchData = decryptDocument(branchData, [
            "email",
            "patients",
            "staffs",
            "branchId",
          ]);

          const staffs = await getStaffs(user.id, branchId);
          decryptedBranchData.staffs = staffs;

          const patients = await getPatients(
            user.id,
            null,
            branchId,
            user.role
          );
          const appointments = await getAppointment(branchId);
          decryptedBranchData.appointments = appointments;
          decryptedBranchData.patients = patients;

          branches.push(decryptedBranchData);
        }
      }

      data = {
        userId: user.id,
        role: user.role,
        organization: org,
        branches,
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
      ]);
      const staffs = await getStaffs(
        user.organizationId,
        user.branchId,
        user.role
      );
      const patients = await getPatients(null, null, user.branchId, user.role);
      const appointments = await getAppointment(user.branchId);
      data = {
        role: user.role,
        userId: user.branchId,
        organizationId: user.organizationId,
        branchData,
        organization,
        patients,
        staffs,
        appointments,
      };
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
      ]);

      const organization = await getOrganizationName(user.organizationId);
      const patients = await getPatients(
        user.organizationId,
        user.staffId,
        user.branchId,
        user.role
      );
      data = {
        role: user.role,
        userId: user.staffId,
        branchId: user.branchId,
        organizationId: user.organizationId,
        organization,
        staffData,
        patients,
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
      ]);

      const organization = await getOrganizationName(user.organizationId);
      const patients = await getPatients(
        null,
        user.staffId,
        user.branchId,
        user.role
      );

      const patientsWithVisits = await Promise.all(
        patients.map(async (patient) => {
          const visits = await getVisit(patient.patientId, patient.doctorId);
          return {
            ...patient,
            visits,
          };
        })
      );

      const doctors = await getBranchDoctors(
        user.organizationId,
        user.branchId
      );
      console.log(doctors);

      data = {
        role: user.role,
        userId: user.staffId,
        branchId: user.branchId,
        organizationId: user.organizationId,
        organization,
        staffData,
        patients: patientsWithVisits,
        doctors,
      };
    }

    return data;
  } catch (error) {
    console.error("Login failed:", error.message);
    throw new Error("Login failed: " + error.message);
  }
};

module.exports = { addUser, loginUser, EmailAlreadyExistsError };
