const express = require("express");
const router = express.Router();
const {
  addUserHandler,
  loginUserHandler,
  getNewAccessToken,
  changeUserPasswordHandler,
  sendOTPHandler,
  verifyOTPHandler,
  forgotChangePasswordHandler,
} = require("../Controller/userController");

router.post("/add", addUserHandler);
router.post("/login", loginUserHandler);
router.post("/new-access", getNewAccessToken);
router.post("/change-password", changeUserPasswordHandler);
router.post("/send-otp", sendOTPHandler);
router.post("/verify-otp", verifyOTPHandler);
router.post("/forgot-password-change", forgotChangePasswordHandler);
module.exports = router;
