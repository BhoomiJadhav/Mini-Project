// const protect = (req, res, next) => {
//   const authHeader = req.headers.authorization;

//   if (authHeader && authHeader.startsWith("Bearer ")) {
//     const token = authHeader.split(" ")[1];

//     try {
//       const decoded = jwt.verify(token, process.env.JWT_SECRET);
//       req.user = await User.findById(decoded.id).select("-password");;
//       next();
//     } catch (error) {
//       return res.status(401).json({ message: "Invalid token" });
//     }
//   } else {
//     return res.status(401).json({ message: "No token, authorization denied" });
//   }
// };

const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await User.findById(decoded.id).select("-password");
      next();
    } catch (err) {
      console.error("Token verification failed:", err.message);
      return res.status(401).json({ message: "Not authorized, token failed" });
    }
  } else {
    return res.status(401).json({ message: "Not authorized, no token" });
  }
};

module.exports = { protect };

// Middleware to check if user role is admin
const adminOnly = (req, res, next) => {
  const fixedAdminEmail = process.env.ADMIN_EMAIL; // Store in .env file

  if (req.user && req.user.email === fixedAdminEmail) {
    next();
  } else {
    res.status(403).json({ message: "Access denied. Admins only." });
  }
};

module.exports = { protect, adminOnly };
