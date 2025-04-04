require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());
app.use(cors());

// Import Routes
const authRoutes = require("./routes/authRoutes");
const orderRoutes = require("./routes/orderRoutes");
const adminRoutes = require("./routes/adminRoutes");

app.use("/api/auth", authRoutes); // Authentication routes
app.use("/api/orders", orderRoutes); // Customer order management
app.use("/api/admin", adminRoutes); // Admin controls

// Default route
app.get("/", (req, res) => {
  res.send("Milk Distributor API is running...");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
