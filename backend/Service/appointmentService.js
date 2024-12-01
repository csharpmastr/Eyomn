const admin = require("firebase-admin");
const { v4: uuid } = require("uuid");
const {
  appointmentCollection,
  organizationCollection,
  staffCollection,
  db,
} = require("../Config/FirebaseConfig");

const { decryptData, encryptData } = require("../Security/DataHashing");
const {
  decryptDocument,
  encryptDocument,
  generateUniqueId,
  verifyFirebaseUid,
} = require("../Helper/Helper");
const { collection, query, getDocs, where } = require("firebase/firestore");

const addSchedule = async (branchId, scheduleDetails, firebaseUid) => {
  try {
    await verifyFirebaseUid(firebaseUid);

    const schedRef = appointmentCollection
      .doc(branchId)
      .collection("schedules");

    const scheduleId = await generateUniqueId(schedRef);

    const encryptedDetails = encryptDocument(scheduleDetails, [
      "scheduledTime",
      "doctorId",
    ]);

    const thirtyMinuteGap = 30 * 60 * 1000;

    const newStartTime = new Date(scheduleDetails.scheduledTime).getTime();
    const newEndTime = newStartTime + thirtyMinuteGap;

    const schedulesSnapshot = await schedRef.get();
    schedulesSnapshot.forEach((doc) => {
      const existingScheduleTime = new Date(doc.data().scheduledTime).getTime();
      const existingReason = decryptData(doc.data().reason);

      const requiredGap =
        existingReason === "check up" || existingReason === "consultation"
          ? thirtyMinuteGap
          : 0;

      const existingStartTime = existingScheduleTime;
      const existingEndTime = existingStartTime + requiredGap;

      if (newStartTime < existingEndTime && newEndTime > existingStartTime) {
        if (newStartTime === existingStartTime) {
          throw {
            status: 409,
            message: "A schedule already exists at this time.",
          };
        }
        if (scheduleDetails.reason === "eyeglass") {
          return;
        }
        throw {
          status: 422,
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
    await verifyFirebaseUid(firebaseUid);
    const scheduleRef = appointmentCollection
      .doc(branchId)
      .collection("schedules")
      .doc(appointmentId);

    await scheduleRef.delete();
  } catch (error) {
    console.error("Error deleting schedule: ", error.message);
  }
};

const getAppointments = async (
  branchId,
  staffId = null,
  firebaseUid,
  isDoctor = true
) => {
  try {
    await verifyFirebaseUid(firebaseUid);

    let appointments = [];

    const branchDocRef = appointmentCollection.doc(branchId);
    const schedulesSnapshot = await branchDocRef.collection("schedules").get();

    if (schedulesSnapshot.empty) {
      console.log("No schedules found for this branch.");
      return [];
    }

    schedulesSnapshot.forEach((scheduleDoc) => {
      const scheduleDetails = scheduleDoc.data();

      if (isDoctor) {
        if (scheduleDetails.doctorId === staffId) {
          const decryptedSchedule = decryptDocument(scheduleDetails, [
            "branchId",
            "createdAt",
            "id",
            "scheduledTime",
            "doctorId",
          ]);
          appointments.push(decryptedSchedule);
        }
      } else {
        if (!staffId || scheduleDetails.staffId === staffId) {
          const decryptedSchedule = decryptDocument(scheduleDetails, [
            "branchId",
            "createdAt",
            "id",
            "scheduledTime",
            "doctorId",
          ]);
          appointments.push(decryptedSchedule);
        }
      }
    });

    return appointments;
  } catch (error) {
    console.error("Error fetching appointments:", error);
    throw error;
  }
};

const getDoctorAppointments = async (doctorId, firebaseUid) => {
  try {
    await verifyFirebaseUid(firebaseUid);

    const doctorRef = staffCollection.doc(doctorId);
    const doctorDoc = await doctorRef.get();

    if (!doctorDoc.exists) {
      throw { status: 404, message: "Doctor not found." };
    }

    const docData = doctorDoc.data();

    if (!docData.branches || !Array.isArray(docData.branches)) {
      throw { status: 404, message: "No branches found for the doctor." };
    }

    let appointments = [];

    for (const branch of docData.branches) {
      const branchId = branch.branchId;

      const branchAppointments = await getAppointments(
        branchId,
        doctorId,
        firebaseUid,
        true
      );
      const branchAppointmentsWithId = branchAppointments.map(
        (appointment) => ({
          ...appointment,
          branchId,
        })
      );
      appointments = [...appointments, ...branchAppointmentsWithId];
    }

    return appointments;
  } catch (error) {
    console.error("Error fetching doctor appointments:", error);
    return {
      status: error.status || 500,
      message:
        error.message || "An error occurred while fetching appointments.",
    };
  }
};

const updateAppointment = async (
  branchId,
  appointmentId,
  updatedDetails,
  firebaseUid
) => {
  try {
    await verifyFirebaseUid(firebaseUid);

    const schedRef = appointmentCollection
      .doc(branchId)
      .collection("schedules");

    const appointmentDocRef = schedRef.doc(appointmentId);

    const appointmentDoc = await appointmentDocRef.get();
    if (!appointmentDoc.exists) {
      throw {
        status: 404,
        message: "Appointment not found.",
      };
    }

    const existingDetails = appointmentDoc.data();
    const thirtyMinuteGap = 30 * 60 * 1000;

    const newStartTime = new Date(updatedDetails.scheduledTime).getTime();
    const newEndTime =
      newStartTime +
      (updatedDetails.duration
        ? updatedDetails.duration * 60 * 1000
        : thirtyMinuteGap);

    const schedulesSnapshot = await schedRef.get();

    if (!schedulesSnapshot.empty) {
      schedulesSnapshot.forEach((doc) => {
        if (doc.id === appointmentId) return;

        const scheduleData = doc.data();
        const existingStartTime = new Date(
          scheduleData.scheduledTime
        ).getTime();
        const existingReason = decryptData(scheduleData.reason);

        const requiredGap =
          existingReason === "check up" || existingReason === "consultation"
            ? thirtyMinuteGap
            : 0;

        const existingEndTime = existingStartTime + requiredGap;

        if (newStartTime < existingEndTime && newEndTime > existingStartTime) {
          throw {
            status: 422,
            message: `Conflict detected with another schedule. Ensure a ${
              requiredGap === thirtyMinuteGap ? "30-minute" : "custom"
            } gap between schedules.`,
          };
        }
      });
    }

    const encryptedDetails = encryptDocument(updatedDetails, [
      "scheduledTime",
      "doctorId",
    ]);

    await appointmentDocRef.set({
      ...existingDetails,
      ...encryptedDetails,
    });

    return `Appointment ${appointmentId} updated successfully.`;
  } catch (error) {
    console.error("Error editing appointment:", error.message);
    if (error.status) {
      throw { status: error.status, message: error.message };
    } else {
      throw new Error("Failed to edit appointment: " + error.message);
    }
  }
};

module.exports = {
  addSchedule,
  deleteSchedule,
  getAppointments,
  getDoctorAppointments,
  updateAppointment,
};
