import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const CustomerDashboard = () => {
  const [summary, setSummary] = useState({
    total: 0,
    completed: 0,
    ongoing: 0,
    unpaid: 0,
  });

  const navigate = useNavigate();

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          "http://localhost:5000/api/orders/summary",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setSummary(res.data);
      } catch (err) {
        console.error("Error fetching summary:", err);
      }
    };

    fetchSummary();
  }, []);

  return (
    <div className="min-h-screen flex bg-[#f7f9fb] text-gray-800">
      {/* Sidebar */}
      <aside className="w-64 bg-[#4F83CC] text-white p-6 shadow-lg">
        <h2 className="text-2xl font-bold mb-8">Kumar Milk Distributors</h2>
        <ul className="space-y-4">
          <li
            onClick={() => {
              localStorage.removeItem("editOrder");
              navigate("/customer-dashboard/place-order");
            }}
            className="cursor-pointer hover:bg-white hover:text-[#83a4c8] px-4 py-2 rounded transition"
          >
            🛒 Place Order
          </li>
          <li
            onClick={() => navigate("/customer-dashboard/ongoing")}
            className="cursor-pointer hover:bg-white hover:text-[#83a4c8] px-4 py-2 rounded transition"
          >
            📦 Ongoing Orders
          </li>
          <li
            onClick={() => navigate("/customer-dashboard/history")}
            className="cursor-pointer hover:bg-white hover:text-[#83a4c8] px-4 py-2 rounded transition"
          >
            🕒 Previous Orders
          </li>
        </ul>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <h2 className="text-2xl font-semibold mb-6">
          👋 Welcome to your Dashboard
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-md border-t-4 border-[#83a4c8]">
            <p className="text-gray-600 font-medium">Total Orders</p>
            <p className="text-3xl font-bold mt-2">{summary.total}</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md border-t-4 border-green-400">
            <p className="text-gray-600 font-medium">Completed Orders</p>
            <p className="text-3xl font-bold mt-2">{summary.completed}</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md border-t-4 border-yellow-400">
            <p className="text-gray-600 font-medium">Ongoing Orders</p>
            <p className="text-3xl font-bold mt-2">{summary.ongoing}</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md border-t-4 border-red-400">
            <p className="text-gray-600 font-medium">Pending Payments</p>
            <p className="text-3xl font-bold mt-2">{summary.unpaid}</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CustomerDashboard;
