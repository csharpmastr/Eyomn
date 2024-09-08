const { db, userCollection } = require("../Config/FirebaseConfig");
const { v4: uuidv4 } = require("uuid");
const {
  encryptData,
  hashPassword,
  decryptData,
} = require("../Security/DataHashing");
const { collection, doc, setDoc, getDocs } = require("firebase/firestore");

const addStaff = async (clinicId, staffData) => {
  try {
    const staffId = uuidv4();
    const encryptedStaffData = {};
    const staffCredentials = {
      staffId: staffId,
      clinicId: clinicId,
      email: staffData.email,
      role: "1",
    };

    for (const [key, value] of Object.entries(staffData)) {
      if (key === "password") {
        const hashedPassword = await hashPassword(value);
        staffCredentials.password = hashedPassword;
      } else if (key !== "email" || key !== "clinicId") {
        encryptedStaffData[key] = encryptData(value);
      } else {
        encryptedStaffData[key] = value;
      }
    }

    encryptedStaffData.role = "1";
    encryptedStaffData.staffId = staffId;

    const userRef = doc(userCollection, staffId);
    const clinicDocRef = doc(db, "clinicStaff", clinicId);
    const staffDocRef = doc(collection(clinicDocRef, "Staff"), staffId);

    await setDoc(userRef, staffCredentials);

    await setDoc(staffDocRef, encryptedStaffData);

    console.log("Staff added successfully with ID: ", staffId);
  } catch (err) {
    console.error("Error adding staff: ", err);
    throw err;
  }
};

const getAllStaff = async (clinicId) => {
  try {
    const clinicStaffRef = doc(db, "clinicStaff", clinicId);
    const staffCollectionRef = collection(clinicStaffRef, "Staff");
    const querySnapshot = await getDocs(staffCollectionRef);

    const staffsData = querySnapshot.docs.map((doc) => {
      const data = doc.data();
      const decryptedData = {};

      for (const [key, value] of Object.entries(data)) {
        if (key === "role" || key === "staffId") {
          decryptedData[key] = value;
        } else {
          decryptedData[key] = decryptData(value);
        }
      }

      return {
        id: doc.id,
        ...decryptedData,
      };
    });

    return staffsData;
  } catch (err) {
    console.error("Error retrieving staff: ", err);
    throw err;
  }
};

module.exports = {
  addStaff,
  getAllStaff,
};
