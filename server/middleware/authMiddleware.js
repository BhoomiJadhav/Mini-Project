const jwt = require("jsonwebtoken");

// Middleware to check if token is present and valid
const protect = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.split(" ")[1];

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
      next();
    } catch (error) {
      return res.status(401).json({ message: "Invalid token" });
    }
  } else {
    return res.status(401).json({ message: "No token, authorization denied" });
  }
};

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
