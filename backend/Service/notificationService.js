const { notificationCollection } = require("../Config/FirebaseConfig");
const { v4: uuid } = require("uuid");
const { serverTimestamp } = require("firebase/firestore");
const { decryptData, encryptData } = require("../Security/DataHashing");
const {
  verifyFirebaseUid,
  generateUniqueId,
  decryptDocument,
} = require("../Helper/Helper");

const pushNotification = async (userId, type, data) => {
  try {
    const notificationId = await generateUniqueId(notificationCollection);
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
    if (type === "sharedPatient") {
      const message = `Patient ${data.patientName} has been shared to you by Dr.${data.doctorName}`;
      const encryptedMessage = encryptData(message);
      notificationData = {
        ...notificationData,
        type: "sharedPatient",
        message: encryptedMessage,
        doctorId: data.doctorId,
        patientId: data.patientId,
      };
    }
    if (type === "soapNote") {
      const message = `Patient ${data.patientName} generated SOAP is ready`;
      const encryptedMessage = encryptData(message);

      notificationData = {
        ...notificationData,
        type: "soapNote",
        message: encryptedMessage,
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

const getNotifications = async (id, firebaseUid) => {
  try {
    verifyFirebaseUid(firebaseUid);

    const notificationRef = notificationCollection.doc(id).collection("notifs");

    const notifSnapshot = await notificationRef.get();

    if (notifSnapshot.empty) {
      return [];
    }

    const notifications = notifSnapshot.docs.map((doc) => {
      const decryptedData = decryptDocument(doc.data(), [
        "patientId",
        "doctorId",
        "branchId",
        "createdAt",
        "type",
        "notificationId",
        "read",
      ]);

      return decryptedData;
    });

    return notifications;
  } catch (error) {
    console.error("Error getting notifications:", error);
    throw new Error("Failed to fetch notifications");
  }
};

module.exports = { pushNotification, updateNotification, getNotifications };
