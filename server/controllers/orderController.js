const Order = require("../models/Order.js");
const jwt = require("jsonwebtoken");
const Inventory = require("../models/Inventory");

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
// const placeOrder = async (req, res) => {
//   try {
//     const authHeader = req.headers.authorization;
//     if (!authHeader || !authHeader.startsWith("Bearer ")) {
//       return res
//         .status(401)
//         .json({ message: "Unauthorized: No token provided" });
//     }

//     const token = authHeader.split(" ")[1];
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     const customerId = decoded.userId;

//     const {
//       amulBuffaloCrates = 0,
//       amulGoldCrates = 0,
//       amulTaazaCrates = 0,
//       gokulCowCrates = 0,
//       gokulBuffaloCrates = 0,
//       gokulFullCreamCrates = 0,
//       mahanandaCrates = 0,
//     } = req.body;

//     const deliveryDate = new Date();
//     deliveryDate.setDate(deliveryDate.getDate() + 1);
//     deliveryDate.setHours(0, 0, 0, 0); // clean start of day

//     // const inventory = await Inventory.findOne({ date: deliveryDate });
//     // if (!inventory) {
//     //   return res
//     //     .status(400)
//     //     .json({ message: "Inventory not set for that day" });
//     // }

//     // // Check if enough stock
//     // const isStockAvailable =
//     //   inventory.amulBuffaloCrates >= amulBuffaloCrates &&
//     //   inventory.amulGoldCrates >= amulGoldCrates &&
//     //   inventory.amulTaazaCrates >= amulTaazaCrates &&
//     //   inventory.gokulCowCrates >= gokulCowCrates &&
//     //   inventory.gokulBuffaloCrates >= gokulBuffaloCrates &&
//     //   inventory.gokulFullCreamCrates >= gokulFullCreamCrates &&
//     //   inventory.mahanandaCrates >= mahanandaCrates;

//     // if (!isStockAvailable) {
//     //   return res.status(400).json({ message: "Not enough stock available" });
//     // }

//     // // Deduct
//     // inventory.amulBuffaloCrates -= amulBuffaloCrates;
//     // inventory.amulGoldCrates -= amulGoldCrates;
//     // inventory.amulTaazaCrates -= amulTaazaCrates;
//     // inventory.gokulCowCrates -= gokulCowCrates;
//     // inventory.gokulBuffaloCrates -= gokulBuffaloCrates;
//     // inventory.gokulFullCreamCrates -= gokulFullCreamCrates;
//     // inventory.mahanandaCrates -= mahanandaCrates;

//     // await inventory.save();

//     const order = new Order({
//       customer: req.user._id,
//       shopName,
//       address,
//       deliveryTime,
//       deliveryDate,
//       amulTaazaCrates,
//       amulGoldCrates,
//       amulBuffaloCrates,
//       gokulCowCrates,
//       gokulBuffaloCrates,
//       gokulFullCreamCrates,
//       mahanandaCrates,
//       paymentMethod,
//       paymentScreenshot: paymentMethod === "Online" ? paymentScreenshot : null,
//       paymentStatus: paymentMethod === "Online" ? "Pending" : "Unpaid",
//       status: "Pending",
//     });

//     await order.save();
//     res.status(201).json({ message: "Order placed successfully", order });
//   } catch (error) {
//     console.error("Order error:", error);
//     res.status(500).json({ message: "Order failed", error: error.message });
//   }
//   const inventory = await Inventory.findOne({ date: tomorrowDate });

//   if (!inventory || inventory[productKey] < orderQty) {
//     return res.status(400).json({ message: "Insufficient inventory" });
//   }

//   inventory[productKey] -= orderQty;
//   await inventory.save();
// };
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
    console.error("Order error:", {
      message: error.message,
      stack: error.stack,
      body: req.body,
    });

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
