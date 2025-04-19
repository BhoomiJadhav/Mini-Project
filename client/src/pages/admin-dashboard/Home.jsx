import { useEffect, useState } from "react";
import axios from "axios";
import {
  PieChart,
  Pie,
  Tooltip,
  Legend,
  Cell,
  ResponsiveContainer,
} from "recharts";

const COLORS = [
  "#4f83cc",
  "#ff9f43",
  "#2ecc71",
  "#e74c3c",
  "#9b59b6",
  "#1abc9c",
  "#34495e",
];

const Home = () => {
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("/api/admin/monthly-summary", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSummary(res.data);
      } catch (err) {
        console.error("Failed to fetch admin summary:", err);
      }
    };

    fetchSummary();
  }, []);

  if (!summary) return <p>Loading dashboard...</p>;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-[#38251c]">🏠 Admin Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl shadow border-t-4 border-blue-400">
          <p className="text-gray-600 font-medium">Total Orders This Month</p>
          <p className="text-2xl font-bold mt-2">{summary.totalOrders}</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow border-t-4 border-green-400">
          <p className="text-gray-600 font-medium">Total Crates Ordered</p>
          <p className="text-2xl font-bold mt-2">{summary.totalCrates}</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow border-t-4 border-yellow-400">
          <p className="text-gray-600 font-medium">Total Revenue</p>
          <p className="text-2xl font-bold mt-2">₹{summary.totalAmount}</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow border-t-4 border-pink-400">
          <p className="text-gray-600 font-medium">Top Product</p>
          <p className="text-2xl font-bold mt-2">
            {summary.mostOrderedProduct.replace(/Crates$/, "")}
          </p>
        </div>
      </div>

      {/* Top Customers */}
      <div className="bg-white p-4 rounded-xl shadow">
        <h2 className="text-lg font-bold text-[#2c3e50] mb-2">
          🥇 Top Customers
        </h2>
        <ul className="list-disc ml-6 text-gray-700">
          {summary.topCustomers.map((c, index) => (
            <li key={index}>
              <span className="font-semibold">{c.shopName}</span> – ₹
              {c.totalAmount} (Crates: {c.totalCrates})
            </li>
          ))}
        </ul>
      </div>

      {/* Pie Chart Summary */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-lg font-bold text-[#2c3e50] mb-4">
          📊 Monthly Product Demand
        </h2>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={Object.entries(summary.crateBreakdown).map(([k, v]) => ({
                name: k.replace(/Crates$/, "").replace(/([A-Z])/g, " $1"),
                value: v,
              }))}
              cx="50%"
              cy="50%"
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
              label={({ name, percent }) =>
                `${name}: ${(percent * 100).toFixed(0)}%`
              }
            >
              {Object.keys(summary.crateBreakdown).map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Home;
