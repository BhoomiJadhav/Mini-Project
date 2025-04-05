const express = require("express");
const Razorpay = require("razorpay");
const router = express.Router();
const crypto = require("crypto");

// Create Razorpay instance
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Route to create a new order
router.post("/razorpay", async (req, res) => {
  try {
    const { amul, gokul, mahananda } = req.body;

    // Total cost logic (you can customize this)
    const totalAmount = (amul * 50 + gokul * 45 + mahananda * 40) * 100; // in paise

    const options = {
      amount: totalAmount,
      currency: "INR",
      receipt: `receipt_order_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);

    res.status(200).json({
      razorpayOrderId: order.id,
      amount: order.amount,
      currency: order.currency,
    });
  } catch (err) {
    console.error("Razorpay error:", err);
    res.status(500).json({ error: "Failed to create order" });
  }
});
router.post("/verify", async (req, res) => {
  try {
    const {
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
      shopName,
      address,
      deliveryTime,
      amul,
      gokul,
      mahananda,
    } = req.body;

    // Signature verification
    const body = razorpayOrderId + "|" + razorpayPaymentId;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature !== razorpaySignature) {
      return res.status(400).json({ error: "Payment verification failed" });
    }

    // Save order to DB (your existing order model here)
    // This is just an example; replace it with your actual DB save logic
    const order = new Order({
      shopName,
      address,
      deliveryTime,
      amul,
      gokul,
      mahananda,
      paymentMethod: "ONLINE",
      paymentStatus: "PAID",
      razorpayOrderId,
      razorpayPaymentId,
    });

    await order.save();

    res.status(200).json({ message: "Payment verified and order placed!" });
  } catch (err) {
    console.error("Payment verification error:", err);
    res.status(500).json({ error: "Failed to verify payment" });
  }
});

module.exports = router;
