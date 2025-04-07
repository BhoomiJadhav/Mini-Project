// const Order = require("../models/Order.js");
// const jwt = require("jsonwebtoken");

// const getUserIdFromToken = (req) => {
//   const authHeader = req.headers.authorization;

//   if (!authHeader || !authHeader.startsWith("Bearer ")) {
//     throw new Error("Not authorized, token missing or malformed");
//   }

//   const token = authHeader.split(" ")[1];
//   const decoded = jwt.verify(token, process.env.JWT_SECRET);

//   return decoded.id;
// };

// const placeOrder = async (req, res) => {
//   try {
//     const authHeader = req.headers.authorization;

//     if (!authHeader || !authHeader.startsWith("Bearer ")) {
//       return res
//         .status(401)
//         .json({ message: "Unauthorized: No token provided" });
//     }

//     const token = authHeader.split(" ")[1];
//     const decoded = jwt.verify(token, process.env.JWT_SECRET); // Make sure JWT_SECRET is set in your .env
//     console.log("Decoded token:", decoded);

//     const customerId = decoded.userId;
//     console.log("Customer ID to attach:", customerId);

//     const orderData = {
//       ...req.body,
//       customer: customerId,
//     };

//     const newOrder = new Order(orderData);
//     await newOrder.save();

//     res
//       .status(201)
//       .json({ message: "Order placed successfully", order: newOrder });
//   } catch (error) {
//     console.error("Error placing order:", error);
//     res
//       .status(500)
//       .json({ message: "Failed to place order", error: error.message });
//   }
// };

// const getOngoingOrders = async (req, res) => {
//   try {
//     // Extract token from Authorization header
//     const token = req.headers.authorization?.split(" ")[1];

//     if (!token) {
//       return res.status(401).json({ message: "Authorization token missing" });
//     }

//     // Verify and decode token
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     const userId = decoded.id;

//     // Date filter: from today's start to tomorrow's start
//     const now = new Date();

//     const todayUTC = new Date(
//       Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())
//     );
//     const tomorrowUTC = new Date(todayUTC);
//     tomorrowUTC.setUTCDate(todayUTC.getUTCDate() + 1);

//     const tomorrow = new Date(today);
//     tomorrow.setDate(today.getDate() + 1);

//     // Fetch ongoing orders
//     const ongoingOrders = await Order.find({
//       customer: userId,
//       createdAt: { $gte: todayUTC, $lt: tomorrowUTC },
//     }).sort({ createdAt: -1 });

//     res.status(200).json(ongoingOrders);
//   } catch (err) {
//     console.error("Failed to fetch ongoing orders:", err);
//     res.status(500).json({
//       message: "Failed to fetch ongoing orders",
//       error: err.message,
//     });
//   }
// };

// const getOrderHistory = async (req, res) => {
//   try {
//     const userId = getUserIdFromToken(req);

//     const today = new Date();
//     today.setHours(0, 0, 0, 0);

//     const historyOrders = await Order.find({
//       customer: userId, // ✅ FIXED
//       createdAt: { $lt: today },
//     }).sort({ createdAt: -1 });

//     res.json(historyOrders);
//   } catch (err) {
//     res
//       .status(500)
//       .json({ message: "Failed to fetch order history", error: err.message });
//   }
// };

// module.exports = { placeOrder, getOngoingOrders, getOrderHistory };
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

module.exports = { placeOrder, getOngoingOrders, getOrderHistory };
