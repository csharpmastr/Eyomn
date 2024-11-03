import { updateNotification } from "../Service/notificationService";

const updateNotificationHandler = async (req, res) => {
  try {
    const notificationId = req.params.notificationId;
    const { read } = req.body;
    console.log(read);
    const { firebaseUid, staffId } = req.query;

    await updateNotification(staffId, notificationId, firebaseUid, read);
    return res
      .status(200)
      .json({ message: "Notification Updated Successfully." });
  } catch (error) {
    console.error("Error updating notification details: ", error);
    return res.status(500).json({
      message: "Error updating notification details",
      error: error.message,
    });
  }
};

module.exports = updateNotificationHandler;
