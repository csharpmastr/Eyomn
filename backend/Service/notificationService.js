const { notificationCollection } = require("../Config/FirebaseConfig");
const { v4: uuid } = require("uuid");
const { serverTimestamp } = require("firebase/firestore");
const { decryptData, encryptData } = require("../Security/DataHashing");
const { verifyFirebaseUid } = require("../Helper/Helper");

const pushNotification = async (userId, type, data) => {
  try {
    const notificationId = uuid();
    const currentDate = new Date();
    const notificationCol = notificationCollection
      .doc(userId)
      .collection("notifs");

    let notificationData = {
      notificationId,
      createdAt: currentDate.toISOString(),
      read: false,
    };

    if (type === "newPatient") {
      const message = `New patient registered: ${data.patientName}.`;
      const encryptedMessage = encryptData(message);
      notificationData = {
        ...notificationData,
        type: "newPatient",
        message: encryptedMessage,
        branchId: data.branchId,
        doctorId: data.doctorId,
        patientId: data.patientId,
      };
    }

    if (type === "returnPatient") {
      const message = `Patient ${data.patientName} has returned for a follow-up visit.`;
      const encryptedMessage = encryptData(message);
      notificationData = {
        ...notificationData,
        type: "returnPatient",
        message: encryptedMessage,
        branchId: data.branchId,
        doctorId: data.doctorId,
        patientId: data.patientId,
      };
    }
    await notificationCol.doc(notificationId).set(notificationData);
    console.log(`Notification of type "${type}" added for user ${userId}`);
  } catch (error) {
    console.error("Error adding notification:", error);
  }
};

const updateNotification = async (
  staffId,
  notificationId,
  firebaseUid,
  read
) => {
  try {
    await verifyFirebaseUid(firebaseUid);
    const notificationRef = notificationCollection
      .doc(staffId)
      .collection("notifs")
      .doc(notificationId);
    console.log(notificationId, read);

    await notificationRef.update({ read });
  } catch (error) {
    console.error("Error updating notification:", error);
  }
};

module.exports = { pushNotification, updateNotification };
