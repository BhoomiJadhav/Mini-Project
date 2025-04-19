const Order = require("../models/Order");
const { Parser } = require("json2csv");
const { Inventory } = require("../models/Inventory");

const getAllOrders = async (req, res) => {
  try {
    const { shopName, deliveryDate, paymentStatus, status } = req.query;

    const query = {};

    // 🔍 Shop name search (partial match)
    if (shopName) {
      query.shopName = { $regex: shopName, $options: "i" };
    }

    // 📅 Exact delivery date match
    if (deliveryDate) {
      const date = new Date(deliveryDate);
      date.setHours(0, 0, 0, 0);

      const nextDate = new Date(date);
      nextDate.setDate(nextDate.getDate() + 1);

      query.deliveryDate = { $gte: date, $lt: nextDate };
    }

    // 💰 Payment status filter
    if (paymentStatus) {
      query.paymentStatus = paymentStatus;
    }

    // 📦 Delivery status filter
    if (status) {
      query.status = status;
    }

    const allOrders = await Order.find(query)
      .populate("customer", "name email address")
      .sort({ deliveryDate: 1 });

    res.status(200).json(allOrders);
  } catch (error) {
    console.error("Error fetching filtered orders:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { paymentStatus, status } = req.body;

    const updated = await Order.findByIdAndUpdate(
      req.params.id,
      { ...(paymentStatus && { paymentStatus }), ...(status && { status }) },
      { new: true }
    );

    res.status(200).json(updated);
  } catch (err) {
    console.error("Error updating status:", err);
    res.status(500).json({ message: "Server error" });
  }
};
const getDailyDeliveryCSV = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const orders = await Order.find({
      deliveryDate: { $gte: today, $lt: tomorrow },
    }).populate("customer", "name email address");

    // Flatten the data for CSV
    const flatOrders = orders.map((order) => ({
      customerName: order.shopName || "N/A",
      customerAddress: order.address || "N/A",
      deliveryDate: order.deliveryDate,
      status: order.status,
      paymentStatus: order.paymentStatus,
      amulBuffaloCrates: order.amulBuffaloCrates,
      amulGoldCrates: order.amulGoldCrates,
      amulTaazaCrates: order.amulTaazaCrates,
      gokulCowCrates: order.gokulCowCrates,
      gokulBuffaloCrates: order.gokulBuffaloCrates,
      gokulFullCreamCrates: order.gokulFullCreamCrates,
      mahanandaCrates: order.mahanandaCrates,
      TotalAmount: order.totalAmount,
    }));

    const fields = [
      "customerName",
      "customerAddress",
      "deliveryDate",
      "status",
      "paymentStatus",
      "amulBuffaloCrates",
      "amulGoldCrates",
      "amulTaazaCrates",
      "gokulCowCrates",
      "gokulBuffaloCrates",
      "gokulFullCreamCrates",
      "mahanandaCrates",
    ];

    const parser = new Parser({ fields });
    const csv = parser.parse(flatOrders);

    res.header("Content-Type", "text/csv");
    res.attachment("daily-deliveries.csv");
    return res.send(csv);
  } catch (err) {
    console.error("CSV export error:", err);
    res.status(500).json({ message: "Failed to generate CSV" });
  }
};
const setInventoryForDate = async (req, res) => {
  try {
    const { date, ...inventoryData } = req.body;
    const cleanDate = new Date(date);
    cleanDate.setHours(0, 0, 0, 0);

    const existing = await Inventory.findOne({ date: cleanDate });

    if (existing) {
      // Update existing
      await Inventory.updateOne({ date: cleanDate }, inventoryData);
      return res.status(200).json({ message: "Inventory updated" });
    }

    // Create new
    const inventory = new Inventory({ date: cleanDate, ...inventoryData });
    await inventory.save();
    res.status(201).json({ message: "Inventory created" });
  } catch (err) {
    console.error("Error setting inventory:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get Inventory for a Specific Date
const getInventoryForDate = async (req, res) => {
  try {
    const cleanDate = new Date(req.params.date);
    cleanDate.setHours(0, 0, 0, 0);

    const inventory = await Inventory.findOne({ date: cleanDate });

    if (!inventory)
      return res.status(404).json({ message: "Inventory not found" });

    res.status(200).json(inventory);
  } catch (err) {
    console.error("Error getting inventory:", err);
    res.status(500).json({ message: "Server error" });
  }
};

const getMonthlySummary = async (req, res) => {
  try {
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const orders = await Order.find({ deliveryDate: { $gte: startOfMonth } });

    let totalCrates = 0;
    let totalAmount = 0;
    let crateCounts = {
      amulTaazaCrates: 0,
      amulGoldCrates: 0,
      amulBuffaloCrates: 0,
      gokulCowCrates: 0,
      gokulBuffaloCrates: 0,
      gokulFullCreamCrates: 0,
      mahanandaCrates: 0,
    };

    const customerMap = {};

    for (const order of orders) {
      totalAmount += order.totalAmount || 0;

      for (const key in crateCounts) {
        crateCounts[key] += order[key] || 0;
        totalCrates += order[key] || 0;
      }

      const shop = order.shopName;
      if (!customerMap[shop]) {
        customerMap[shop] = { shopName: shop, totalAmount: 0, totalCrates: 0 };
      }

      customerMap[shop].totalAmount += order.totalAmount || 0;
      customerMap[shop].totalCrates += Object.keys(crateCounts).reduce(
        (sum, k) => sum + (order[k] || 0),
        0
      );
    }

    const mostOrdered = Object.entries(crateCounts).sort(
      (a, b) => b[1] - a[1]
    )[0][0];
    const topCustomers = Object.values(customerMap)
      .sort((a, b) => b.totalAmount - a.totalAmount)
      .slice(0, 3);

    res.json({
      totalOrders: orders.length,
      totalAmount,
      totalCrates,
      mostOrderedProduct: mostOrdered,
      crateBreakdown: crateCounts,
      topCustomers,
    });
  } catch (err) {
    console.error("Monthly summary error:", err);
    res.status(500).json({ message: "Failed to fetch summary" });
  }
};

module.exports = {
  getAllOrders,
  updateOrderStatus,
  getDailyDeliveryCSV,
  getInventoryForDate,
  setInventoryForDate,
  getMonthlySummary,
};
