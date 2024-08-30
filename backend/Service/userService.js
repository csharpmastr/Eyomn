const { v4: uuidv4 } = require("uuid");
const {
  setDoc,
  doc,
  collection,
  getDocs,
  query,
  where,
} = require("firebase/firestore");
const { db } = require("../Config/FirebaseConfig");
const {
  hashPassword,
  encryptData,
  comparePassword,
} = require("../Security/DataHashing");

const UserCollection = collection(db, "users");

class EmailAlreadyExistsError extends Error {
  constructor(message) {
    super(message);
    this.name = "EmailAlreadyExistsError";
  }
}

const addUser = async (userData) => {
  try {
    const q = query(UserCollection, where("email", "==", userData.email));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      throw new EmailAlreadyExistsError("Email already exists.");
    }

    const hashedPassword = await hashPassword(userData.password);

    const encryptedFName = encryptData(userData.firstname);
    const encryptedLName = encryptData(userData.lastname);
    const encryptedContact = encryptData(userData.contact);

    const userId = uuidv4();
    const userRef = doc(UserCollection, userId);

    await setDoc(userRef, {
      email: userData.email,
      password: hashedPassword,
      firstname: encryptedFName,
      lastname: encryptedLName,
      contact: encryptedContact,
      id: userId,
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
    const userQuery = query(UserCollection, where("email", "==", email));
    const querySnapshot = await getDocs(userQuery);

    if (querySnapshot.empty) {
      throw new Error("Invalid email or password");
    }

    const user = querySnapshot.docs[0].data();
    const isPasswordValid = await comparePassword(password, user.password);

    if (!isPasswordValid) {
      throw new Error("Invalid email or password");
    }

    return { userId: user.id };
  } catch (error) {
    throw new Error("Login failed: " + error.message);
  }
};

module.exports = { addUser, loginUser };
