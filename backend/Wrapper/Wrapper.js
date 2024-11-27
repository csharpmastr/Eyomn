const jwt = require("jsonwebtoken");
require("dotenv").config();

const validateToken = (req, res, next) => {
  console.log("Cookies:", req.cookies);
  const accessToken = req.cookies.accessToken;
  const refreshToken = req.cookies.refreshToken;

  if (!accessToken || !refreshToken) {
    return res.status(401).json({ message: "No tokens provided" });
  }

  jwt.verify(
    accessToken,
    process.env.JWT_ACCESS_SECRET,
    (err, decodedAccess) => {
      if (err) {
        if (err.name === "TokenExpiredError") {
          jwt.verify(
            refreshToken,
            process.env.JWT_REFRESH_SECRET,
            (err, decodedRefresh) => {
              if (err || !decodedRefresh) {
                return res
                  .status(401)
                  .json({ message: "Both tokens expired, please login again" });
              }
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

              req.accessToken = newAccessToken;
              next();
            }
          );
        } else {
          return res.status(401).json({ message: "Invalid access token" });
        }
      } else {
        req.accessToken = accessToken;
        next();
      }
    }
  );
};

module.exports = {
  validateToken,
};
