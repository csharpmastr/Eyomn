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
    };

    for (const [key, value] of Object.entries(staffData)) {
      if (key === "password") {
        staffCredentials["password"] = await hashPassword(value);
      } else if (key === "email" || key === "clinicId") {
        encryptedStaffData[key] = value;
      } else {
        encryptedStaffData[key] = encryptData(value);
      }
    }

    if (
      staffData.position === "Ophthalmologist" ||
      staffData.position === "Optometrist"
    ) {
      encryptedStaffData.role = "1";
      staffCredentials.role = "1";
    } else if (staffData.position === "Staff") {
      encryptedStaffData.role = "2";
      staffCredentials.role = "2";
    }

    encryptedStaffData.staffId = staffId;
    const userRef = doc(userCollection, staffId);
    const clinicDocRef = doc(db, "clinicStaff", clinicId);
    const staffDocRef = doc(collection(clinicDocRef, "Staff"), staffId);

    await setDoc(userRef, staffCredentials);

    await setDoc(staffDocRef, encryptedStaffData);
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

    if (querySnapshot.empty) {
      return [];
    }

    const staffsData = querySnapshot.docs.map((doc) => {
      const data = doc.data();
      const decryptedData = {};

      for (const [key, value] of Object.entries(data)) {
        if (key === "role" || key === "staffId" || key === "email") {
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

const getDoctorsList = async (clinicId) => {
  try {
    const clinicStaffRef = doc(db, "clinicStaff", clinicId);
    const staffCollectionRef = collection(clinicStaffRef, "Staff");

    const querySnapshot = await getDocs(staffCollectionRef);
    const doctorNames = [];
    querySnapshot.forEach((doc) => {
      const staffData = doc.data();

      const decryptedPosition = decryptData(staffData.position);
      const decryptedName = decryptData(staffData.name);
      if (
        decryptedPosition === "Optometrist" ||
        decryptedPosition === "Ophthalmologist"
      ) {
        doctorNames.push({
          id: doc.id,
          name: decryptedName,
          position: decryptedPosition,
        });
      }
    });

    return doctorNames;
  } catch (error) {
    console.error("Error fetching doctor list:", error);
    throw error;
  }
};

module.exports = {
  addStaff,
  getAllStaff,
  getDoctorsList,
};
