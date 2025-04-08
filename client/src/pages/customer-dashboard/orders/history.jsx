import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const History = () => {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/orders/history", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const data = await res.json();
        setOrders(data);
      } catch (err) {
        console.error("Failed to fetch history orders", err);
      }
    };

    fetchHistory();
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-60 bg-[#4f83cc] text-white p-6">
        <h1 className="text-2xl font-bold mb-6">Customer</h1>
        <nav className="space-y-4">
          <button
            onClick={() => navigate("/customer-dashboard")}
            className="block w-full text-left hover:bg-[#4073b4] p-2 rounded"
          >
            📝 Place Order
          </button>
          <button
            onClick={() => navigate("/customer-dashboard/ongoing")}
            className="block w-full text-left hover:bg-[#4073b4] p-2 rounded"
          >
            📋 Ongoing Orders
          </button>
          <button
            onClick={() => navigate("/customer-dashboard/history")}
            className="block w-full text-left bg-[#4073b4] p-2 rounded"
          >
            🕓 Order History
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <h2 className="text-2xl font-semibold mb-6 text-[#4f83cc]">
          🕓 Order History
        </h2>

        {orders.length === 0 ? (
          <p>No past orders found.</p>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div
                key={order._id}
                className="bg-white shadow-md rounded-xl p-6 hover:shadow-lg transition"
              >
                <div className="grid sm:grid-cols-2 gap-3 text-gray-700">
                  <p>
                    <strong>Shop:</strong> {order.shopName}
                  </p>
                  <p>
                    <strong>Address:</strong> {order.address}
                  </p>
                  <p>
                    <strong>Delivery Time:</strong> {order.deliveryTime}
                  </p>
                  <p>
                    <strong>Payment Method:</strong> {order.paymentMode}
                  </p>
                  <p>
                    <strong>Date:</strong>{" "}
                    {new Date(order.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default History;
