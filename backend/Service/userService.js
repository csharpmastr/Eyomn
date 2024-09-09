require("dotenv").config();
const { v4: uuidv4 } = require("uuid");
const {
  setDoc,
  doc,
  getDocs,
  getDoc,
  query,
  where,
} = require("firebase/firestore");
const {
  clinicCollection,
  userCollection,
  clinicStaffCollection,
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

const addUser = async (clinicData) => {
  try {
    const q = query(
      clinicCollection,
      where("email", "==", encryptData(clinicData.email))
    );
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      throw new EmailAlreadyExistsError("Email already exists.");
    }

    const hashedPassword = await hashPassword(clinicData.password);
    const encryptedOrganization = encryptData(clinicData.organization);
    const encryptedContact = encryptData(clinicData.contact);

    const userId = uuidv4();

    const clinicRef = doc(clinicCollection, userId);
    const userRef = doc(userCollection, userId);

    await setDoc(clinicRef, {
      email: clinicData.email,
      organization: encryptedOrganization,
      contact: encryptedContact,
      id: userId,
      role: "0",
    });

    await setDoc(userRef, {
      email: clinicData.email,
      password: hashedPassword,
      id: userId,
      role: "0",
    });

    return { userId, organization: clinicData.organization, role: "0" };
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
    // Query user by email
    const userQuery = query(userCollection, where("email", "==", email));
    const querySnapshot = await getDocs(userQuery);

    if (querySnapshot.empty) {
      throw new Error("Invalid email or password");
    }

    const user = querySnapshot.docs[0].data();

    // Verify password
    const isPasswordValid = await comparePassword(password, user.password);

    if (!isPasswordValid) {
      throw new Error("Invalid email or password");
    }

    if (!user.role) {
      throw new Error("User role not found");
    }

    let data = null;

    // Handle role-specific data
    if (user.role === "0") {
      // Fetch clinic data
      const clinicQuery = query(clinicCollection, where("id", "==", user.id));
      const clinicSnapshot = await getDocs(clinicQuery);

      if (clinicSnapshot.empty) {
        throw new Error("Clinic data not found");
      }

      const clinic = clinicSnapshot.docs[0].data();
      const org = decryptData(clinic.organization);
      data = {
        userId: user.id,
        role: user.role,
        organization: org,
      };
    } else {
      const clinicId = user.clinicId;
      const staffId = user.staffId;

      if (!clinicId || !staffId) {
        throw new Error("Clinic ID or Staff ID not found");
      }

      const staffRef = doc(clinicStaffCollection, clinicId, "Staff", staffId);
      const staffSnapshot = await getDoc(staffRef);

      if (!staffSnapshot.exists()) {
        throw new Error("Staff data not found");
      }

      const staffDataSnap = staffSnapshot.data();
      const staffData = {};

      for (const [key, value] of Object.entries(staffDataSnap)) {
        if (key === "role" || key === "email" || key === "staffId") {
          staffData[key] = value;
        } else {
          staffData[key] = decryptData(value);
        }
      }

      const clinicRef = doc(clinicCollection, clinicId);
      const clinicSnapShot = await getDoc(clinicRef);
      if (!clinicSnapShot.exists()) {
        throw new Error("Clinic data not found");
      }

      const clinicData = clinicSnapShot.data();
      const organizationName = decryptData(clinicData.organization);

      data = {
        userId: staffId,
        role: user.role,
        clinicId: clinicId,
        staffData,
        organization: organizationName,
      };
    }

    return data;
  } catch (error) {
    console.error("Login failed:", error.message);
    throw new Error("Login failed: " + error.message);
  }
};

module.exports = { addUser, loginUser };
