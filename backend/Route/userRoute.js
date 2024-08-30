const express = require("express");
const router = express.Router();
const {
  addUserHandler,
  loginUserHandler,
} = require("../Controller/UserController");

router.post("/add", addUserHandler);
router.post("/login", loginUserHandler);

module.exports = router;
