const express = require("express");
const {
  updateNotificationReadHandler,
  getNotificationsHandler,
} = require("../Controller/notificationController");
const { validateToken } = require("../Wrapper/Wrapper");

const router = express.Router();

router.patch(
  "/update/:notificationId",
  validateToken,
  updateNotificationReadHandler
);
router.get("/get-notifications", validateToken, getNotificationsHandler);
module.exports = router;
