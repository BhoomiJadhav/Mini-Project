const Order = require("../models/Order.js");
const jwt = require("jsonwebtoken");
const Inventory = require("../models/Inventory");
const PDFDocument = require("pdfkit");
const generateInvoice = require("../utils/generateInvoice.js");

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

const placeOrder = async (req, res) => {
  try {
    const {
      shopName,
      address,
      deliveryTime,
      deliveryDate,
      amulTaazaCrates = 0,
      amulGoldCrates = 0,
      amulBuffaloCrates = 0,
      gokulCowCrates = 0,
      gokulBuffaloCrates = 0,
      gokulFullCreamCrates = 0,
      mahanandaCrates = 0,
      paymentMethod,

      totalAmount,
    } = req.body;

    // Auth
    const token = req.headers.authorization?.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const customerId = decoded.userId;

    // Normalize delivery date
    const date = new Date(deliveryDate);
    date.setHours(0, 0, 0, 0);

    // Fetch inventory
    const inventory = await Inventory.findOne({ date });
    if (!inventory) {
      return res
        .status(400)
        .json({ message: "Inventory not set for this delivery date." });
    }

    // Check stock
    const stockOK =
      inventory.amulBuffaloCrates >= amulBuffaloCrates &&
      inventory.amulGoldCrates >= amulGoldCrates &&
      inventory.amulTaazaCrates >= amulTaazaCrates &&
      inventory.gokulCowCrates >= gokulCowCrates &&
      inventory.gokulBuffaloCrates >= gokulBuffaloCrates &&
      inventory.gokulFullCreamCrates >= gokulFullCreamCrates &&
      inventory.mahanandaCrates >= mahanandaCrates;

    if (!stockOK) {
      return res.status(400).json({ message: "Not enough stock available" });
    }

    // Deduct stock
    inventory.amulBuffaloCrates -= amulBuffaloCrates;
    inventory.amulGoldCrates -= amulGoldCrates;
    inventory.amulTaazaCrates -= amulTaazaCrates;
    inventory.gokulCowCrates -= gokulCowCrates;
    inventory.gokulBuffaloCrates -= gokulBuffaloCrates;
    inventory.gokulFullCreamCrates -= gokulFullCreamCrates;
    inventory.mahanandaCrates -= mahanandaCrates;

    await inventory.save();

    // Create order
    const normalizedPaymentMethod = paymentMethod?.toUpperCase();
    const uploadedScreenshot = req.file ? req.file.filename : null;
    const order = new Order({
      customer: customerId,
      shopName,
      address,
      deliveryTime,
      deliveryDate: date,
      amulTaazaCrates,
      amulGoldCrates,
      amulBuffaloCrates,
      gokulCowCrates,
      gokulBuffaloCrates,
      gokulFullCreamCrates,
      mahanandaCrates,
      paymentMethod: normalizedPaymentMethod,
      paymentScreenshot:
        normalizedPaymentMethod === "ONLINE" ? uploadedScreenshot : null,
      paymentStatus:
        normalizedPaymentMethod === "ONLINE" ? "Pending" : "Unpaid",
      totalAmount,
      status: "Pending",
    });
    await order.save();

    res.status(201).json({ message: "Order placed successfully", order });
  } catch (error) {
    console.error("Order error:", error);
    res.status(500).json({ message: "Order failed", error: error.message });
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
    const userId = getUserIdFromToken(req);

    const order = await Order.findOne({ _id: req.params.id, customer: userId });

    if (!order) {
      return res
        .status(404)
        .json({ message: "Order not found or access denied" });
    }

    const [hours, minutes] = order.deliveryTime.split(":").map(Number);
    const deliveryDateTime = new Date(order.deliveryDate);
    deliveryDateTime.setHours(hours, minutes, 0, 0);

    const bufferLimit = new Date(
      deliveryDateTime.getTime() - 2 * 60 * 60 * 1000
    );

    if (new Date() > bufferLimit) {
      return res.status(403).json({
        message: "Edit not allowed within 2 hours of delivery time.",
      });
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      }
    );

    res.json(updatedOrder);
  } catch (error) {
    console.error("Error updating order:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const deleteOrder = async (req, res) => {
  try {
    const userId = getUserIdFromToken(req);

    const order = await Order.findOne({ _id: req.params.id, customer: userId });

    if (!order) {
      return res
        .status(404)
        .json({ error: "Order not found or access denied" });
    }

    const [hours, minutes] = order.deliveryTime.split(":").map(Number);
    const deliveryDateTime = new Date(order.deliveryDate);
    deliveryDateTime.setHours(hours, minutes, 0, 0);

    const bufferLimit = new Date(
      deliveryDateTime.getTime() - 2 * 60 * 60 * 1000
    );

    if (new Date() > bufferLimit) {
      return res.status(400).json({
        error: "Cannot delete order within 2 hours of delivery",
      });
    }

    await order.deleteOne();
    res.json({ message: "Order deleted successfully" });
  } catch (err) {
    console.error("Delete error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

const getCustomerSummary = async (req, res) => {
  try {
    const userId = getUserIdFromToken(req);

    // Get order statistics
    const totalOrders = await Order.countDocuments({ customer: userId });
    const completedOrders = await Order.countDocuments({
      customer: userId,
      status: "Delivered",
    });
    const ongoingOrders = await Order.countDocuments({
      customer: userId,
      status: { $ne: "Delivered" },
    });
    const unpaidOrders = await Order.countDocuments({
      customer: userId,
      paymentStatus: "Unpaid",
    });

    // Monthly summary
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const orders = await Order.find({
      customer: userId,
      deliveryDate: { $gte: startOfMonth },
    });

    let totalCrates = 0;
    let totalAmount = 0;
    const crateCounts = {
      amulTaazaCrates: 0,
      amulGoldCrates: 0,
      amulBuffaloCrates: 0,
      gokulCowCrates: 0,
      gokulBuffaloCrates: 0,
      gokulFullCreamCrates: 0,
      mahanandaCrates: 0,
    };

    for (const order of orders) {
      totalAmount += order.totalAmount || 0;
      for (const key in crateCounts) {
        crateCounts[key] += order[key] || 0;
        totalCrates += order[key] || 0;
      }
    }

    const mostOrdered = Object.entries(crateCounts).sort(
      (a, b) => b[1] - a[1]
    )[0][0];

    res.json({
      total: totalOrders,
      completed: completedOrders,
      ongoing: ongoingOrders,
      unpaid: unpaidOrders,
      totalCrates,
      totalAmount,
      mostOrderedProduct: mostOrdered,
      crateBreakdown: crateCounts,
    });
  } catch (err) {
    console.error("Summary error:", err);
    res.status(500).json({ error: "Failed to fetch customer summary" });
  }
};

const downloadInvoice = async (req, res) => {
  try {
    const orderId = req.params.id;
    const order = await Order.findById(orderId).populate(
      "customer",
      "name email"
    );

    if (!order) return res.status(404).json({ message: "Order not found" });

    res.setHeader(
      "Content-Disposition",
      `attachment; filename=invoice_${orderId}.pdf`
    );
    res.setHeader("Content-Type", "application/pdf");

    generateInvoice(order, res);
  } catch (err) {
    console.error("Invoice error:", err);
    res.status(500).json({ message: "Failed to generate invoice" });
  }
};

module.exports = {
  placeOrder,
  getOngoingOrders,
  getOrderHistory,
  updateOrder,
  deleteOrder,
  getCustomerSummary,
  downloadInvoice,
};
