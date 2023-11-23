// middleware/verifyLogin.js

const jwt = require("jsonwebtoken");

const verifyLogin = (req, res, next) => {
  const token = req.header("Authorization");

  if (!token) {
    return res.status(401).json({ message: "Unauthorized - Missing token" });
  }

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Unauthorized - Invalid token" });
    }

    req.user = {
      userId: decoded.userId,
      role: decoded.role,
    };

    next();
  });
};

module.exports = verifyLogin;
