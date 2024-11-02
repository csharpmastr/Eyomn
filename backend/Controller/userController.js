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
      role,
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
    const {
      userId,
      role,
      organization,
      branches,
      branchData,
      organizationId,
      staffData,
      patients,
      staffs,
      doctors,
      appointments,
      firebaseUid,
    } = await loginUser({
      email,
      password,
    });
    console.log("hello");

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
        branch: branches,
        firebaseUid: firebaseUid,
      });
    } else if (role === "1") {
      res.status(200).json({
        userId: userId,
        role: role,
        message: "Login successful",
        organizationId,
        organization,
        tokens: {
          accessToken,
          refreshToken,
        },
        branchData,
        patients,
        staffs,
        appointments,
        firebaseUid,
      });
    } else {
      res.status(200).json({
        userId: userId,
        role: role,
        message: "Login successful",
        organizationId,
        organization,
        tokens: {
          accessToken,
          refreshToken,
        },
        staffData,
        patients,
        doctors,
      });
    }
  } catch (error) {
    res.status(401).json({
      success: false,
      message: error.message || "Login failed",
    });
  }
};

const getNewAccessToken = (req, res) => {
  try {
    const refreshToken = req.body.refreshToken;

    if (!refreshToken) {
      return res.status(403).json({ message: "Refresh token not valid" });
    }

    jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, (err, user) => {
      if (err) {
        return res.status(403).json({ message: "Token verification failed" });
      }

      const accessToken = generateToken(
        user.userId,
        process.env.JWT_ACCESS_SECRET,
        "5h"
      );

      return res.json({ accessToken });
    });
  } catch (error) {
    console.error("Error refreshing token:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { addUserHandler, loginUserHandler, getNewAccessToken };
