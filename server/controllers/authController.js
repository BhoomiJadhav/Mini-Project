const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const validator = require("validator");
const nodemailer = require("nodemailer");
const User = require("../models/User");
ADMIN_EMAIL = "j.bhoomi16@gmail.com";
ADMIN_PASSWORD = "Admin@123";

// Util function to send email
const sendEmail = async (email, username) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER, // Your email
      pass: process.env.EMAIL_PASS, // Your app password
    },
  });

  await transporter.sendMail({
    from: `"Milk Distributor" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Welcome to Milk Distributor App",
    html: `<h3>Welcome ${username}!</h3><p>Your account has been created successfully.</p>`,
  });
};

// Register user
const registerUser = async (req, res) => {
  try {
    const { name, email, password, confirmPassword } = req.body;

    if (!name || !email || !password || !confirmPassword) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Determine role based on fixed credentials
    const role =
      email === ADMIN_EMAIL && password === ADMIN_PASSWORD
        ? "admin"
        : "customer";

    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("Password before hashing:", password);
    console.log("Hashed password being saved:", hashedPassword);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
    });

    // Send confirmation email
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Registration Successful",
      html: `<h3>Hi ${name},</h3><p>You've successfully registered on Milk Distributor Platform.</p>`,
    };

    await transporter.sendMail(mailOptions);

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Registration Error:", error);
    res.status(500).json({ message: "Server error during registration" });
  }
};

// Login user
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }
    console.log("Email received:", email);
    console.log("User found:", user);
    if (user) {
      console.log("Plain password:", password);
      console.log("Hashed password in DB:", user.password);
    }

    if (!user) {
      console.log("User not found for email:", email);
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    console.log(
      "Login attempt for:",
      email,
      "Password valid:",
      isPasswordValid
    );

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Automatically assign role based on email
    // Use role from DB instead of hardcoded
    const role = user.role;

    const token = jwt.sign(
      { _id: user._id, username: user.username, email: user.email, role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      token,
      role,
      redirectTo: role === "admin" ? "/admin-dashboard" : "/customer-dashboard",
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error." });
  }
};

module.exports = { registerUser, loginUser };
