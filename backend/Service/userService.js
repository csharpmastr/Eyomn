const { v4: uuidv4 } = require("uuid");
const { setDoc, doc, getDocs, query, where } = require("firebase/firestore");
const { clinicCollection } = require("../Config/FirebaseConfig");
const {
  hashPassword,
  encryptData,
  comparePassword,
} = require("../Security/DataHashing");

class EmailAlreadyExistsError extends Error {
  constructor(message) {
    super(message);
    this.name = "EmailAlreadyExistsError";
  }
}

const addUser = async (clinicData) => {
  try {
    const q = query(clinicCollection, where("email", "==", clinicData.email));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      throw new EmailAlreadyExistsError("Email already exists.");
    }

    const hashedPassword = await hashPassword(clinicData.password);

    const encryptedFName = encryptData(clinicData.firstname);
    const encryptedLName = encryptData(clinicData.lastname);
    const encryptedContact = encryptData(clinicData.contact);

    const userId = uuidv4();
    const userRef = doc(clinicCollection, userId);

    await setDoc(userRef, {
      email: clinicData.email,
      password: hashedPassword,
      firstname: encryptedFName,
      lastname: encryptedLName,
      contact: encryptedContact,
      id: userId,
      role: "0",
    });

    return userId;
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
    const userQuery = query(clinicCollection, where("email", "==", email));
    const querySnapshot = await getDocs(userQuery);

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

    return { userId: user.id, role: user.role };
  } catch (error) {
    throw new Error("Login failed: " + error.message);
  }
};

module.exports = { addUser, loginUser };
