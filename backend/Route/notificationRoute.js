const express = require("express");
const {
  updateNotificationReadHandler,
  getNotificationsHandler,
} = require("../Controller/notificationController");

const router = express.Router();

router.patch("/update/:notificationId", updateNotificationReadHandler);
router.get("/get-notifications", getNotificationsHandler);
module.exports = router;
