const express = require("express");
const {
  getOrdersForAdmin,
  updateOrderStatus,
} = require("../controllers/adminController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/orders", protect, adminOnly, getOrdersForAdmin);
router.put("/orders/:id/status", protect, adminOnly, updateOrderStatus);

module.exports = router;
