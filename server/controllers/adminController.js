const Order = require("../models/Order");

const getOrdersForAdmin = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("customer", "name email")
      .sort({ deliveryTime: 1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) return res.status(404).json({ message: "Order not found" });

    order.status = req.body.status || order.status;
    order.paymentStatus = req.body.paymentStatus || order.paymentStatus;

    await order.save();
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getOrdersForAdmin, updateOrderStatus };
