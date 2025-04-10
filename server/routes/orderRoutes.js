const express = require("express");
const {
  placeOrder,
  getOngoingOrders,
  getOrderHistory,
  deleteOrder,
  updateOrder,
  getOrderSummary,
} = require("../controllers/orderController.js");
const upload = require("../middleware/upload.js");

const { protect } = require("../middleware/authMiddleware.js"); // ✅ important

const router = express.Router();
router.post("/place", upload.single("paymentScreenshot"), protect, placeOrder);
router.get("/ongoing", protect, getOngoingOrders);
router.get("/history", protect, getOrderHistory);
router.delete("/:id", protect, deleteOrder);
router.put("/:id", protect, updateOrder);
router.get("/summary", protect, getOrderSummary);

module.exports = router;
