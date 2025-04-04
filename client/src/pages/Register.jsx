import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setMessage("");

    const { name, email, password, confirmPassword } = formData;

    console.log("Form Data before validation:", formData); // 🔍 Debug

    // Check if any field is empty
    if (
      !name.trim() ||
      !email.trim() ||
      !password.trim() ||
      !confirmPassword.trim()
    ) {
      setMessage("All fields are required");
      console.error("Validation Failed: Empty Fields"); // 🔴 Debug
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex =
      /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (!emailRegex.test(email)) {
      setMessage("Please enter a valid email address");
      console.error("Validation Failed: Invalid Email"); // 🔴 Debug
      return;
    }

    if (!passwordRegex.test(password)) {
      setMessage(
        "Password must be at least 8 characters long, include an uppercase letter, number, and symbol"
      );
      console.error("Validation Failed: Weak Password"); // 🔴 Debug
      return;
    }

    if (password !== confirmPassword) {
      setMessage("Passwords do not match");
      console.error("Validation Failed: Password Mismatch"); // 🔴 Debug
      return;
    }

    try {
      const cleanedData = {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password,
        confirmPassword,
      };

      console.log("Sending Data to Backend:", cleanedData); // 🔍 Debug

      const res = await axios.post(
        "http://localhost:5000/api/auth/register",
        cleanedData
      );

      console.log("Registration Response:", res.data); // ✅ Debug

      setMessage(res.data.message);
      alert("Registration successful!");
      navigate("/login");
    } catch (error) {
      console.error("Registration Error:", error.response?.data || error); // 🔴 Debug
      setMessage(
        error.response?.data?.message ||
          "Registration failed. Please try again."
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#83a4c8]">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96 border-[5px] border-[#5b8db7]">
        <h2 className="text-3xl font-bold text-[#8B4513] text-center mb-6">
          Register
        </h2>
        {message && <p className="text-red-500 text-center mb-4">{message}</p>}
        <form onSubmit={handleRegister}>
          <div className="mb-4">
            <label className="block text-[#4A4A4A] font-medium mb-1">
              Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5b8db7]"
              placeholder="Enter your name"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-[#4A4A4A] font-medium mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5b8db7]"
              placeholder="Enter your email"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-[#4A4A4A] font-medium mb-1">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5b8db7]"
              placeholder="Enter your password"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-[#4A4A4A] font-medium mb-1">
              Confirm Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5b8db7]"
              placeholder="Confirm your password"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-[#5b8db7] hover:bg-[#4a7ea3] text-white font-semibold py-3 rounded-lg shadow-md"
          >
            Register
          </button>
        </form>
        <p className="mt-4 text-center text-gray-600">
          Already registered?{" "}
          <span
            onClick={() => navigate("/login")}
            className="text-[#5b8db7] hover:underline cursor-pointer"
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
};

export default Register;
