// middleware/verifyLogin.js

const jwt = require("jsonwebtoken");

const verifyLogin = async (req, res, next) => {
  const token = req.cookies.token;

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

const isAdmin = async (req, res, next) => {
  // Check if the user has the 'admin' role
  if (req.user && req.user.role === "admin") {
    next(); // User is an admin, proceed to the next middleware or route handler
  } else {
    res.status(403).json({
      message: "Forbidden - Only admin users can access this resource",
    });
  }
};

module.exports = { verifyLogin, isAdmin };
