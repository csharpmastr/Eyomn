const express = require("express");
const router = express.Router();
const {
  addUserHandler,
  loginUserHandler,
  getNewAccessToken,
  changeUserPasswordHandler,
} = require("../Controller/UserController");

router.post("/add", addUserHandler);
router.post("/login", loginUserHandler);
router.post("/new-access", getNewAccessToken);
router.post("/change-password", changeUserPasswordHandler);

module.exports = router;
