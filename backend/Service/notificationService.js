const { notificationCollection } = require("../Config/FirebaseConfig");
const { v4: uuid } = require("uuid");
const { serverTimestamp } = require("firebase/firestore");

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
      notificationData = {
        ...notificationData,
        type: "newPatient",
        message: `A new patient has been added.`,
        branchId: data.branchId,
        doctorId: data.doctorId,
      };
    }
    await notificationCol.doc(notificationId).set(notificationData);
    console.log(`Notification of type "${type}" added for user ${userId}`);
  } catch (error) {
    console.error("Error adding notification:", error);
  }
};

module.exports = { pushNotification };
