const {
  addUser,
  loginUser,
  changeUserPassword,
  sendOTP,
  verifyOTP,
  forgotChangePassword,
} = require("../Service/userService");
const jwt = require("jsonwebtoken");

const generateToken = (id, secret, duration) => {
  return jwt.sign({ id }, secret, { expiresIn: duration });
};
const blacklistedTokens = new Set();

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
      isNew,
    } = await loginUser({ email, password });

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

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: false,
      sameSite: "Strict",
      maxAge: 5 * 60 * 60 * 1000,
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "Strict",
      maxAge: 24 * 60 * 60 * 1000,
    });

    const responsePayload = {
      userId,
      isNew,
      role,
      message: "Login successful",
      firebaseUid,
    };

    if (role === "0") {
      responsePayload.organization = organization;
      responsePayload.branch = branches;
    } else if (role === "1") {
      Object.assign(responsePayload, {
        organizationId,
        organization,
        branchData,
        patients,
        staffs,
        appointments,
      });
    } else {
      Object.assign(responsePayload, {
        organizationId,
        organization,
        staffData,
        patients,
        doctors,
      });
    }

    res.status(200).json(responsePayload);
  } catch (error) {
    res.status(401).json({
      success: false,
      message: error.message || "Login failed",
    });
  }
};

const getNewAccessToken = (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(403).json({ message: "Refresh token not found" });
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

const changeUserPasswordHandler = async (req, res) => {
  const { organizationId, branchId, staffId, role, password, newPassword } =
    req.body;
  const { firebaseUid } = req.query;
  let userId;
  try {
    if (!password || !newPassword) {
      return res
        .status(400)
        .json({ message: "Current password and new password are required." });
    }

    if (organizationId) {
      userId = organizationId;
    } else if (branchId) {
      userId = branchId;
    } else if (staffId) {
      userId = staffId;
    } else {
      return res.status(400).json({
        message:
          "Either organizationId, branchId, or staffId must be provided.",
      });
    }
    await changeUserPassword(
      organizationId,
      branchId,
      staffId,
      role,
      firebaseUid,
      password,
      newPassword
    );

    return res.status(200).json({ message: "Password updated successfully." });
  } catch (error) {
    console.error("Error changing password:", error);
    if (error.status === 400) {
      return res.status(400).json({ message: error.message });
    }
    return res
      .status(500)
      .json({ message: "Server error, please try again later." });
  }
};
const sendOTPHandler = async (req, res) => {
  try {
    const email = req.body.email;

    await sendOTP(email);
    res.status(200).json({ message: "OTP sent successfully!" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server error, please try again later." });
  }
};
const verifyOTPHandler = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const verificationResult = verifyOTP(email, otp);

    if (verificationResult === true) {
      return res.status(200).json({ message: "OTP verified successfully." });
    } else if (verificationResult === "OTP has expired.") {
      return res.status(400).json({ message: "OTP has expired." });
    } else if (verificationResult === "OTP not found.") {
      return res.status(400).json({ message: "OTP not found." });
    } else {
      return res.status(400).json({ message: "Invalid OTP." });
    }
  } catch (error) {
    console.error("Error verifying OTP:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

const forgotChangePasswordHandler = async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    await forgotChangePassword(email, newPassword);
    return res.status(200).json({ message: "Passwor changed successfully" });
  } catch (error) {
    console.error("Error changing:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};
const validateAndRefreshTokens = async (req, res) => {
  const accessToken = req.cookies.accessToken;
  const refreshToken = req.cookies.refreshToken;

  if (!accessToken || !refreshToken) {
    return res.status(401).json({ message: "No tokens provided" });
  }

  try {
    const decodedAccess = jwt.verify(
      accessToken,
      process.env.JWT_ACCESS_SECRET
    );
    console.log("nice refresh");

    return res.status(200).json({ valid: true, user: decodedAccess });
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      try {
        const decodedRefresh = jwt.verify(
          refreshToken,
          process.env.JWT_REFRESH_SECRET
        );
        const newAccessToken = jwt.sign(
          { userId: decodedRefresh.userId },
          process.env.JWT_ACCESS_SECRET,
          { expiresIn: "5h" }
        );

        res.cookie("accessToken", newAccessToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "Strict",
          maxAge: 5 * 60 * 60 * 1000,
        });

        return res.status(200).json({ valid: true, user: decodedRefresh });
      } catch (refreshErr) {
        return res
          .status(401)
          .json({ message: "Session expired, please log in again" });
      }
    } else {
      return res.status(401).json({ message: "Invalid access token" });
    }
  }
};
const userLogout = (req, res) => {
  res.clearCookie("accessToken", { httpOnly: true, path: "/" });
  res.clearCookie("refreshToken", { httpOnly: true, path: "/" });
  res.send("Logged out");
};

module.exports = {
  addUserHandler,
  loginUserHandler,
  getNewAccessToken,
  changeUserPasswordHandler,
  sendOTPHandler,
  verifyOTPHandler,
  forgotChangePasswordHandler,
  validateAndRefreshTokens,
  userLogout,
};
