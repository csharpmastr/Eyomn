const {
  updateNotification,
  getNotifications,
} = require("../Service/notificationService");

const updateNotificationReadHandler = async (req, res) => {
  try {
    const { firebaseUid, staffId } = req.query;
    const { read } = req.body;
    const notificationId = req.params.notificationId;
    console.log(staffId, notificationId);

    await updateNotification(staffId, notificationId, firebaseUid, read);
    return res.status(200).json({ message: "Notification updated!" });
  } catch (error) {
    return res.status(500).json({ error: error });
  }
};

const getNotificationsHandler = async (req, res) => {
  try {
    const { firebaseUid, staffId } = req.query;

    if (!staffId) {
      return res.status(400).json({ message: "No Staff ID provided." });
    }
    const notifications = await getNotifications(staffId, firebaseUid);

    if (notifications) {
      return res.status(200).json(notifications);
    }
  } catch (error) {
    return res.status(500).json({ error: error });
  }
};

module.exports = {
  updateNotificationReadHandler,
  getNotificationsHandler,
};
