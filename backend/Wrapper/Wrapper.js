const jwt = require("jsonwebtoken");
require("dotenv").config();

const verifyToken = async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const refreshToken = req.headers["x-refresh-token"];

  if (!authHeader) {
    return res.status(403).json({ message: "No access token provided" });
  }

  const accessToken = authHeader.split(" ")[1];

  try {
    // Verify the access token
    const decodedAccess = jwt.verify(accessToken, process.env.JWT_ACCESS_TOKEN);
    req.user = decodedAccess;
    return next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      if (!refreshToken) {
        return res.status(403).json({ message: "No refresh token provided" });
      }

      try {
        const decodedRefresh = jwt.verify(
          refreshToken,
          process.env.JWT_REFRESH_TOKEN
        );

        const newAccessToken = jwt.sign(
          { userId: decodedRefresh.userId },
          process.env.JWT_ACCESS_TOKEN,
          { expiresIn: "1h" }
        );

        req.user = decodedRefresh;
        return next();
      } catch (refreshErr) {
        return res
          .status(401)
          .json({ message: "Refresh token is invalid or expired" });
      }
    } else {
      return res.status(401).json({ message: "Invalid access token" });
    }
  }
};

module.exports = verifyToken;
