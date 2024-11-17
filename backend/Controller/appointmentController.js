const {
  addSchedule,
  deleteSchedule,
  getAppointments,
  getDoctorAppointments,
  updateAppointment,
} = require("../Service/appointmentService");

const addScheduleHandler = async (req, res) => {
  try {
    const branchId = req.params.branchId;
    const { firebaseUid } = req.query;
    const scheduleDetails = req.body;

    const scheduleId = await addSchedule(
      branchId,
      scheduleDetails,
      firebaseUid
    );
    return res.status(200).json({
      message: "Schedule added successfully.",
      scheduleId: scheduleId,
    });
  } catch (error) {
    if (error.status === 409) {
      return res.status(409).json({ message: error.message });
    } else if (error.status === 422) {
      return res.status(422).json({ message: error.message });
    }
    return res
      .status(500)
      .json({ message: "Error adding appointment.", error: error.message });
  }
};
const deleteScheduleHandler = async (req, res) => {
  try {
    const { branchId, appointmentId, firebaseUid } = req.query;

    console.log(branchId, appointmentId);

    if (!branchId || !appointmentId) {
      return res
        .status(400)
        .json({ message: "Branch ID  and Schedule ID are required." });
    }
    await deleteSchedule(branchId, appointmentId, firebaseUid);
    res.status(200).json({ message: "Schedule deleted sucessfully" });
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message });
  }
};

const getAppoitmentsHandler = async (req, res) => {
  try {
    const { branchId, firebaseUid } = req.query;

    if (!branchId) {
      return res.status(401).json({ message: "Branch ID are required" });
    }
    const appointments = await getAppointments(
      branchId,
      null,
      firebaseUid,
      false
    );

    return res.status(200).json(appointments);
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message });
  }
};
const getDoctorAppointmentHandler = async (req, res) => {
  try {
    const { doctorId, firebaseUid } = req.query;
    if (!doctorId) {
      return res.status(401).json({ message: "doctorId are required" });
    }
    const appointments = await getDoctorAppointments(doctorId, firebaseUid);
    console.log(appointments);

    return res.status(200).json(appointments);
  } catch (error) {
    return res.status(error.status || 500).json({ message: error.message });
  }
};
const updateAppointmentHandler = async (req, res) => {
  try {
    const { firebaseUid, branchId, appointmentId } = req.query;
    const appointmentDetails = req.body;

    await updateAppointment(
      branchId,
      appointmentId,
      appointmentDetails,
      firebaseUid
    );

    return res
      .status(200)
      .json({ message: "Appointment Update Successfully!" });
  } catch (error) {
    return res.status(error.status || 500).json({ message: error.message });
  }
};
module.exports = {
  addScheduleHandler,
  deleteScheduleHandler,
  getAppoitmentsHandler,
  getDoctorAppointmentHandler,
  updateAppointmentHandler,
};
