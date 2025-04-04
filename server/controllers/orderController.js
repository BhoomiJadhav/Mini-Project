const Order = require("../models/Order.js");

const createOrder = async (req, res) => {
  try {
    const {
      shopName,
      address,
      deliveryTime,
      amulTaazaCrates,
      amulGoldCrates,
      amulBuffaloCrates,
      gokulCowCrates,
      gokulBuffaloCrates,
      gokulFullCreamCrates,
      mahanandaCrates,
    } = req.body;

    const order = new Order({
      customer: req.user._id,
      shopName,
      address,
      deliveryTime,
      amulTaazaCrates,
      amulGoldCrates,
      amulBuffaloCrates,
      gokulCowCrates,
      gokulBuffaloCrates,
      gokulFullCreamCrates,
      mahanandaCrates,
    });

    const saved = await order.save();
    res.status(201).json(saved);
  } catch (error) {
    console.error("Create order error:", error);
    res.status(500).json({ message: "Failed to create order" });
  }
};

module.exports = { createOrder };
