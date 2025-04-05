const Order = require("../models/Order.js");
const jwt = require("jsonwebtoken");

const getUserIdFromToken = (req) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new Error("Not authorized, token missing or malformed");
  }

  const token = authHeader.split(" ")[1];
  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  return decoded.id;
};

const placeOrder = async (req, res) => {
  try {
    const userId = getUserIdFromToken(req);
    console.log("User ID from token:", userId);
    console.log("Request body:", req.body);

    const order = new Order({ ...req.body, customer: userId });
    await order.save();

    res.status(201).json({ message: "Order placed successfully", order });
  } catch (err) {
    console.error("Error placing order:", err);
    res
      .status(500)
      .json({ message: "Failed to place order", error: err.message });
  }
};

const getOngoingOrders = async (req, res) => {
  try {
    const userId = getUserIdFromToken(req);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const ongoingOrders = await Order.find({
      customer: userId, // ✅ FIXED
      createdAt: { $gte: today, $lt: tomorrow },
    }).sort({ createdAt: -1 });

    res.json(ongoingOrders);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch ongoing orders", error: err.message });
  }
};

const getOrderHistory = async (req, res) => {
  try {
    const userId = getUserIdFromToken(req);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const historyOrders = await Order.find({
      customer: userId, // ✅ FIXED
      createdAt: { $lt: today },
    }).sort({ createdAt: -1 });

    res.json(historyOrders);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch order history", error: err.message });
  }
};

module.exports = { placeOrder, getOngoingOrders, getOrderHistory };
