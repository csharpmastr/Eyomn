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
  validateAndRefreshTokens,
  userLogout,
} = require("../Controller/userController");

router.post("/add", addUserHandler);
router.post("/login", loginUserHandler);
router.post("/new-access", getNewAccessToken);
router.post("/change-password", changeUserPasswordHandler);
router.post("/send-otp", sendOTPHandler);
router.post("/verify-otp", verifyOTPHandler);
router.post("/forgot-password-change", forgotChangePasswordHandler);
router.get("/validate-and-refresh-tokens", validateAndRefreshTokens);
router.post("/logout", userLogout);
module.exports = router;
