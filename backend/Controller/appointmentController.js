const {
  addSchedule,
  deleteSchedule,
  getAppointments,
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
    const { branchId, appointmentId } = req.query;

    console.log(branchId, appointmentId);

    if (!branchId || !appointmentId) {
      return res
        .status(400)
        .json({ message: "Branch ID  and Schedule ID are required." });
    }
    await deleteSchedule(branchId, appointmentId);
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
    const appointments = await getAppointments(branchId, firebaseUid);

    return res.status(200).json(appointments);
  } catch (error) {
    if (error.status === 404) {
      res.status(error.status || 400).json({ message: error.message });
    }
    res.status(error.status || 500).json({ message: error.message });
  }
};
module.exports = {
  addScheduleHandler,
  deleteScheduleHandler,
  getAppoitmentsHandler,
};
