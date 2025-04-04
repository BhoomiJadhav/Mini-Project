import React, { useEffect, useState } from "react";

const AdminDashboard = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/orders/admin", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setOrders(data))
      .catch((err) => console.error("Error fetching orders:", err));
  }, []);

  return (
    <div className="min-h-screen p-8 bg-gray-100">
      <h2 className="text-3xl font-bold text-[#d7382e]">Admin Dashboard</h2>

      <div className="bg-white p-6 mt-6 rounded-lg shadow-lg">
        <h3 className="text-xl font-semibold text-gray-700 mb-4">All Orders</h3>
        {orders.length === 0 ? (
          <p>No orders available.</p>
        ) : (
          <ul>
            {orders.map((order) => (
              <li key={order._id} className="p-4 border-b">
                <p>
                  <strong>Customer:</strong> {order.customerName}
                </p>
                <p>
                  <strong>Milk Quantity:</strong> {order.quantity} liters
                </p>
                <p>
                  <strong>Delivery Time:</strong> {order.deliveryTime}
                </p>
                <p>
                  <strong>Payment Status:</strong>{" "}
                  {order.paymentStatus ? "Paid" : "Pending"}
                </p>
                <p>
                  <strong>Order Status:</strong> {order.status}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
