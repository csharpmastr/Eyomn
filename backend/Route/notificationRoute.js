const express = require("express");
const updateNotificationReadHandler = require("../Controller/notificationController");

const router = express.Router();

router.patch("/update/:notificationId", updateNotificationReadHandler);

module.exports = router;
