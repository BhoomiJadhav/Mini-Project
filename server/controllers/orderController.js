const Order = require("../models/Order.js");
const jwt = require("jsonwebtoken");

// Helper to extract user ID from token
const getUserIdFromToken = (req) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new Error("Not authorized, token missing or malformed");
  }

  const token = authHeader.split(" ")[1];
  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  return decoded.userId;
};

// Place a new order
const placeOrder = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ message: "Unauthorized: No token provided" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const customerId = decoded.userId; // ✅ Consistent field
    console.log("Customer ID to attach:", customerId);

    const orderData = {
      ...req.body,
      customer: customerId,
    };
    const deliveryDate = new Date(); // set delivery date to tomorrow
    deliveryDate.setDate(deliveryDate.getDate() + 1);
    deliveryDate.setHours(4, 0, 0, 0); // assuming delivery is at 7 AM

    const newOrder = new Order(orderData);
    await newOrder.save();

    res
      .status(201)
      .json({ message: "Order placed successfully", order: newOrder });
  } catch (error) {
    console.error("Error placing order:", error);
    res
      .status(500)
      .json({ message: "Failed to place order", error: error.message });
  }
};

// Get today's ongoing orders for logged-in customer
const getOngoingOrders = async (req, res) => {
  try {
    const userId = getUserIdFromToken(req);

    const now = new Date();
    const todayStart = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate()
    );
    const tomorrowStart = new Date(todayStart);
    tomorrowStart.setDate(todayStart.getDate() + 1);

    const ongoingOrders = await Order.find({
      customer: userId,
      createdAt: {
        $gte: todayStart,
        $lt: tomorrowStart,
      },
    }).sort({ createdAt: -1 });

    res.status(200).json(ongoingOrders);
  } catch (err) {
    console.error("Failed to fetch ongoing orders:", err);
    res.status(500).json({
      message: "Failed to fetch ongoing orders",
      error: err.message,
    });
  }
};

// Get all past orders before today
const getOrderHistory = async (req, res) => {
  try {
    const userId = getUserIdFromToken(req);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const historyOrders = await Order.find({
      customer: userId,
      createdAt: { $lt: today },
    }).sort({ createdAt: -1 });

    res.json(historyOrders);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch order history", error: err.message });
  }
};
const updateOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    const deliveryDate = new Date(order.deliveryDate);

    // Get cutoff time: 12 PM the day before delivery
    const cutoffDate = new Date(deliveryDate);
    cutoffDate.setDate(deliveryDate.getDate() - 1); // one day before delivery
    cutoffDate.setHours(12, 0, 0, 0); // set time to 12:00 PM

    const now = new Date();

    if (now > cutoffDate) {
      return res.status(403).json({
        message:
          "You can no longer edit this order. Edits allowed only till 12 PM a day before delivery.",
      });
    }

    // ✅ Allow update
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(updatedOrder);
  } catch (error) {
    console.error("Error updating order:", error);
    res.status(500).json({ message: "Server error" });
  }
};
// DELETE /api/orders/:id
const deleteOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) return res.status(404).json({ error: "Order not found" });

    const now = new Date();
    const cutoff = new Date();
    cutoff.setHours(12, 0, 0, 0);

    if (now > cutoff) {
      return res
        .status(400)
        .json({ error: "Cannot delete order after 12 PM of current day" });
    }

    await Order.findByIdAndDelete(req.params.id);

    res.json({ message: "Order deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

const getOrderSummary = async (req, res) => {
  try {
    const userId = req.user._id;

    const totalOrders = await Order.countDocuments({ customer: userId });

    const completedOrders = await Order.countDocuments({
      customer: userId,
      status: "Delivered",
    });

    const ongoingOrders = await Order.countDocuments({
      customer: userId,
      status: { $ne: "Delivered" }, // not delivered yet
    });

    const unpaidOrders = await Order.countDocuments({
      customer: userId,
      paymentStatus: "Unpaid",
    });

    res.json({
      total: totalOrders,
      completed: completedOrders,
      ongoing: ongoingOrders,
      unpaid: unpaidOrders,
    });
  } catch (err) {
    console.error("Summary error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = {
  placeOrder,
  getOngoingOrders,
  getOrderHistory,
  updateOrder,
  deleteOrder,
  getOrderSummary,
};
