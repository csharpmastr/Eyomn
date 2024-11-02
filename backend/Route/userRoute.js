const express = require("express");
const router = express.Router();
const {
  addUserHandler,
  loginUserHandler,
  getNewAccessToken,
} = require("../Controller/UserController");

router.post("/add", addUserHandler);
router.post("/login", loginUserHandler);
router.post("/new-access", getNewAccessToken);

module.exports = router;
