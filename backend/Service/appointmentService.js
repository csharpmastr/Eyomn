const admin = require("firebase-admin");
const { v4: uuid } = require("uuid");
const {
  appointmentCollection,
  organizationCollection,
} = require("../Config/FirebaseConfig");

const { decryptData, encryptData } = require("../Security/DataHashing");
const { decryptDocument, encryptDocument } = require("../Helper/Helper");

const addSchedule = async (branchId, scheduleDetails, firebaseUid) => {
  try {
    const userRecord = await admin.auth().getUser(firebaseUid);
    if (!userRecord) {
      throw { status: 404, message: "User not found." };
    }

    console.log(branchId);
    console.log(scheduleDetails);

    const scheduleId = uuid();
    const schedRef = appointmentCollection
      .doc(branchId)
      .collection("schedules");

    const existingSchedules = await schedRef
      .where("scheduledTime", "==", scheduleDetails.scheduledTime)
      .get();

    if (!existingSchedules.empty) {
      throw { status: 400, message: "A schedule already exists at this time." };
    }

    const encryptedDetails = encryptDocument(scheduleDetails, [
      "scheduledTime",
    ]);
    const oneHourGap = 60 * 60 * 1000;
    const thirtyMinuteGap = 30 * 60 * 1000;
    const newScheduleTime = new Date(scheduleDetails.scheduledTime).getTime();

    const schedulesSnapshot = await schedRef.get();
    schedulesSnapshot.forEach((doc) => {
      const existingScheduleTime = new Date(doc.data().scheduledTime).getTime();
      const existingReason = decryptData(doc.data().reason);

      const requiredGap =
        existingReason === "check up" || existingReason === "consultation"
          ? oneHourGap
          : thirtyMinuteGap;

      if (
        (newScheduleTime >= existingScheduleTime - requiredGap &&
          newScheduleTime < existingScheduleTime) ||
        (newScheduleTime + requiredGap > existingScheduleTime &&
          newScheduleTime <= existingScheduleTime)
      ) {
        if (existingReason === "eyeglass") {
          return;
        }
        throw {
          status: 400,
          message: `There must be a ${
            requiredGap === oneHourGap ? "one-hour" : "30-minute"
          } gap between schedules.`,
        };
      }
    });

    const scheduleData = {
      id: scheduleId,
      ...encryptedDetails,
      createdAt: new Date().toISOString(),
    };

    await schedRef.doc(scheduleId).set(scheduleData);
    return scheduleId;
  } catch (error) {
    console.error("Error adding schedule: ", error.message);
    if (error.status) {
      throw { status: error.status, message: error.message };
    } else {
      throw new Error("Failed to add schedule: " + error.message);
    }
  }
};

const deleteSchedule = async (branchId, appointmentId, firebaseUid) => {
  try {
    const userRecord = await admin.auth().getUser(firebaseUid);
    if (!userRecord) {
      throw { status: 404, message: "User not found." };
    }
    const scheduleRef = appointmentCollection
      .doc(branchId)
      .collection("schedules")
      .doc(appointmentId);

    await scheduleRef.delete();
  } catch (error) {
    console.error("Error deleting schedule: ", error.message);
  }
};

const getAppointments = async (branchId, firebaseUid) => {
  try {
    const userRecord = await admin.auth().getUser(firebaseUid);
    if (!userRecord) {
      throw { status: 404, message: "User not found." };
    }
    let appointments = [];

    const branchDocRef = appointmentCollection.doc(branchId);

    const schedulesSnapshot = await branchDocRef.collection("schedules").get();

    if (schedulesSnapshot.empty) {
      console.log("No schedules found for this branch.");
      return [];
    }

    schedulesSnapshot.forEach((scheduleDoc) => {
      const scheduleDetails = scheduleDoc.data();

      const decrytedSChedule = decryptDocument(scheduleDetails, [
        "branchId",
        "createdAt",
        "id",
        "scheduledTime",
        "doctorId",
      ]);
      appointments.push(decrytedSChedule);
    });
    console.log(appointments);
    return appointments;
  } catch (error) {
    console.error("Error fetching appointments:", error);
    throw error;
  }
};

module.exports = {
  addSchedule,
  deleteSchedule,
  getAppointments,
};
