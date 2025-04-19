import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

const COLORS = [
  "#4f83cc",
  "#ff9f43",
  "#2ecc71",
  "#e74c3c",
  "#9b59b6",
  "#1abc9c",
  "#34495e",
];

const CustomerDashboard = () => {
  const [summary, setSummary] = useState({
    total: 0,
    completed: 0,
    ongoing: 0,
    unpaid: 0,
    totalCrates: 0,
    totalAmount: 0,
    mostOrderedProduct: "",
    pieChartData: [],
  });

  const navigate = useNavigate();

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          "https://kumar-milk-distributors.onrender.com/api/orders/summary",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setSummary({
          ...res.data,
          pieChartData: Object.entries(res.data.crateBreakdown || {}).map(
            ([key, value]) => ({
              name: key
                .replace(/Crates$/, "")
                .replace(/([A-Z])/g, " $1")
                .trim(),
              value,
            })
          ),
        });
      } catch (err) {
        console.error("Error fetching summary:", err);
      }
    };

    fetchSummary();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex bg-[#f1f5f9] text-gray-800">
      {/* Sidebar */}
      <aside className="w-64 bg-[#1E3A8A] text-white p-6 shadow-lg flex flex-col">
        <h2 className="text-2xl font-bold mb-8">Kumar Milk Distributors</h2>
        <ul className="space-y-4 flex-1">
          <li
            onClick={() => {
              localStorage.removeItem("editOrder");
              navigate("/customer-dashboard/place-order");
            }}
            className="cursor-pointer hover:bg-[#314E9E] hover:text-[#fff] px-4 py-2 rounded transition"
          >
            🛒 Place Order
          </li>
          <li
            onClick={() => navigate("/customer-dashboard/ongoing")}
            className="cursor-pointer hover:bg-[#314E9E] hover:text-[#fff] px-4 py-2 rounded transition"
          >
            📦 Ongoing Orders
          </li>
          <li
            onClick={() => navigate("/customer-dashboard/history")}
            className="cursor-pointer hover:bg-[#314E9E] hover:text-[#fff] px-4 py-2 rounded transition"
          >
            🕒 Previous Orders
          </li>
        </ul>

        {/* Logout at the bottom */}
        <button
          onClick={handleLogout}
          className="mt-auto text-red-300 hover:text-white text-left"
        >
          🔓 Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <h2 className="text-3xl font-semibold mb-8">
          👋 Welcome to your Dashboard
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Orders"
            value={summary.total}
            borderColor="#83a4c8"
          />
          <StatCard
            title="Completed Orders"
            value={summary.completed}
            borderColor="#34d399"
          />
          <StatCard
            title="Ongoing Orders"
            value={summary.ongoing}
            borderColor="#facc15"
          />
          <StatCard
            title="Pending Payments"
            value={summary.unpaid}
            borderColor="#f87171"
          />
        </div>

        {summary.totalCrates > 0 && (
          <div className="bg-white p-6 rounded-xl shadow-md mt-10">
            <h3 className="text-2xl font-bold text-gray-700 mb-6">
              📊 Monthly Order Summary
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-4">
                <InfoBox
                  color="blue"
                  label="Total Crates Ordered"
                  value={summary.totalCrates}
                />
                <InfoBox
                  color="green"
                  label="Total Amount Spent"
                  value={`₹${summary.totalAmount}`}
                />
                <InfoBox
                  color="yellow"
                  label="Most Ordered Product"
                  value={
                    summary.mostOrderedProduct
                      ?.replace(/Crates$/, "")
                      .replace(/([A-Z])/g, " $1")
                      .trim() || "-"
                  }
                />
              </div>

              <div className="col-span-2 overflow-x-auto">
                <div className="min-w-[800px] flex justify-center items-center">
                  <PieChart width={650} height={400}>
                    <Pie
                      data={summary.pieChartData}
                      cx="55%"
                      cy="50%"
                      outerRadius={130}
                      fill="#8884d8"
                      dataKey="value"
                      labelLine={false}
                      label={({ name, percent }) =>
                        `${name}: ${(percent * 100).toFixed(0)}%`
                      }
                    >
                      {summary.pieChartData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend
                      layout="vertical"
                      verticalAlign="middle"
                      align="right"
                    />
                  </PieChart>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

const StatCard = ({ title, value, borderColor }) => (
  <div
    className={`bg-white p-6 rounded-xl shadow-md border-t-4`}
    style={{ borderTopColor: borderColor }}
  >
    <p className="text-gray-600 font-medium">{title}</p>
    <p className="text-3xl font-bold mt-2">{value}</p>
  </div>
);

const InfoBox = ({ color, label, value }) => {
  const colorMap = {
    blue: "bg-blue-100 text-blue-900",
    green: "bg-green-100 text-green-900",
    yellow: "bg-yellow-100 text-yellow-900",
  };

  return (
    <div
      className={`${colorMap[color]} p-4 rounded-lg shadow-sm font-semibold`}
    >
      {label}: {value}
    </div>
  );
};

export default CustomerDashboard;
