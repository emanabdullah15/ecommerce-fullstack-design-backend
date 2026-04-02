const jwt = require("jsonwebtoken");

// 🔒 Protect routes: check JWT token
const protect = (req, res, next) => {
  let token = req.headers.authorization;

  if (token && token.startsWith("Bearer")) {
    try {
      token = token.split(" ")[1]; // "Bearer TOKEN"
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded; // { id, isAdmin, iat, exp }
      next();
    } catch (error) {
      res.status(401).json({ message: "Token is invalid or expired" });
    }
  } else {
    res.status(401).json({ message: "No token provided" });
  }
};

// 🔑 Admin only
const admin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(403).json({ message: "Admin access only" });
  }
};

module.exports = { protect, admin };