const Order = require("../models/Order");
const { Parser } = require("json2csv");

// GET /api/admin/orders
const getAllOrders = async (req, res) => {
  try {
    const allOrders = await Order.find({})
      .populate("customer", "name email address") // Optional: to show customer details
      .sort({ deliveryDate: 1 });

    res.status(200).json(allOrders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// PATCH /api/admin/orders/:id/status
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

module.exports = { getAllOrders, updateOrderStatus, getDailyDeliveryCSV };
