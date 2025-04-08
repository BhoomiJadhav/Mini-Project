const express = require("express");
const {
  getAllOrders,
  updateOrderStatus,
  getDailyDeliveryCSV,
} = require("../controllers/adminController");
const {
  setInventoryForDate,
  getInventoryForDate,
} = require("../controllers/adminController.js");
const { protect, adminOnly } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/orders", protect, adminOnly, getAllOrders);
router.patch("/orders/:id/status", protect, adminOnly, updateOrderStatus);
router.get("/deliveries/csv", protect, adminOnly, getDailyDeliveryCSV);

router.post("/inventory", protect, adminOnly, setInventoryForDate);
router.get("/inventory/:date", protect, adminOnly, getInventoryForDate);

module.exports = router;
