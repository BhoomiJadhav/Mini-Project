import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/login";
import RegisterPage from "./pages/Register";
import AdminDashboard from "./pages/dashboard/admin";
import CustomerDashboard from "./pages/dashboard/customer";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/customer-dashboard" element={<CustomerDashboard />} />
      </Routes>
    </Router>
  );
};

export default App;
