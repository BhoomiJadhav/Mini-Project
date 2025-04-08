const express = require("express");
const {
  getAllOrders,
  updateOrderStatus,
  getDailyDeliveryCSV,
} = require("../controllers/adminController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/orders", protect, adminOnly, getAllOrders);
router.patch("/orders/:id/status", protect, adminOnly, updateOrderStatus);
router.get("/deliveries/csv", protect, adminOnly, getDailyDeliveryCSV);

module.exports = router;
