const { v4: uuid } = require("uuid");
const { appointmentCollection } = require("../Config/FirebaseConfig");

const addSchedule = async (branchId, scheduleDetails) => {
  try {
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

    const oneHourGap = 60 * 60 * 1000;
    const newScheduleTime = new Date(scheduleDetails.scheduledTime).getTime();

    const schedulesSnapshot = await schedRef.get();
    schedulesSnapshot.forEach((doc) => {
      const existingScheduleTime = new Date(doc.data().scheduledTime).getTime();

      if (Math.abs(existingScheduleTime - newScheduleTime) < oneHourGap) {
        throw {
          status: 400,
          message: "There must be a one-hour gap between schedules.",
        };
      }
    });

    const scheduleData = {
      id: scheduleId,
      branchId: branchId,
      ...scheduleDetails,
      createdAt: new Date().toISOString(),
    };

    await schedRef.doc(scheduleId).set(scheduleData);
  } catch (error) {
    console.error("Error adding schedule: ", error.message);
    if (error.status) {
      throw { status: error.status, message: error.message };
    } else {
      throw new Error("Failed to add schedule: " + error.message);
    }
  }
};

const deleteSchedule = async (branchId, appointmentId) => {
  try {
    const scheduleRef = appointmentCollection
      .doc(branchId)
      .collection("schedules")
      .doc(appointmentId);

    await scheduleRef.delete();
  } catch (error) {
    console.error("Error deleting schedule: ", error.message);
  }
};

module.exports = {
  addSchedule,
  deleteSchedule,
};
