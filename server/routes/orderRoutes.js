const express = require("express");
const {
  placeOrder,
  getOngoingOrders,
  getOrderHistory,
} = require("../controllers/orderController.js");

const { protect } = require("../middleware/authMiddleware.js"); // ✅ important

const router = express.Router();

router.post("/", protect, placeOrder);
router.get("/ongoing", protect, getOngoingOrders);
router.get("/history", protect, getOrderHistory);

module.exports = router;
