const { addUser, loginUser } = require("../Service/UserService");
const jwt = require("jsonwebtoken");

const generateToken = (id, secret, duration) => {
  return jwt.sign({ id }, secret, { expiresIn: duration });
};

const addUserHandler = async (req, res) => {
  try {
    const userData = req.body;
    const { userId, role, organization } = await addUser(userData);
    const accessToken = generateToken(
      userId,
      process.env.JWT_ACCESS_SECRET,
      "5h"
    );
    const refreshToken = generateToken(
      userId,
      process.env.JWT_REFRESH_SECRET,
      "1d"
    );

    res.status(201).send({
      message: "User registered successfully",
      userId: userId,
      organization: organization,
      token: {
        accessToken: accessToken,
        refreshToken,
        refreshToken,
      },
    });
  } catch (error) {
    if (error.name === "EmailAlreadyExistsError") {
      res.status(400).send({ error: error.message });
    } else {
      res.status(500).send({ error: error.message });
    }
  }
};

const loginUserHandler = async (req, res) => {
  const { email, password } = req.body;

  try {
    const { userId, role, organization, staffData } = await loginUser({
      email,
      password,
    });

    const accessToken = generateToken(
      userId,
      process.env.JWT_ACCESS_SECRET,
      "5h"
    );
    const refreshToken = generateToken(
      userId,
      process.env.JWT_REFRESH_SECRET,
      "1d"
    );

    if (role === "0") {
      res.status(200).json({
        userId: userId,
        role: role,
        message: "Login successful",
        organization: organization,
        tokens: {
          accessToken,
          refreshToken,
        },
      });
    } else {
      res.status(200).json({
        userId: userId,
        role: role,
        message: "Login successful",
        staffData: staffData,
        organization: organization,
        tokens: {
          accessToken,
          refreshToken,
        },
      });
    }
  } catch (error) {
    res.status(401).json({
      success: false,
      message: error.message || "Login failed",
    });
  }
};
module.exports = { addUserHandler, loginUserHandler };
