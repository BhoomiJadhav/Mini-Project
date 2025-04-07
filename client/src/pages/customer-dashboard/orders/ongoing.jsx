import React, { useEffect, useState } from "react";
import axios from "axios";

const Ongoing = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          "http://localhost:5000/api/orders/ongoing",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log("Fetched orders:", res.data); // Helpful for debugging
        setOrders(res.data);
      } catch (error) {
        console.error(
          "Error fetching orders:",
          error.response?.data || error.message
        );
        setOrders([]); // fallback to empty array
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">📦 Ongoing Orders</h2>
      {loading ? (
        <p>Loading...</p>
      ) : Array.isArray(orders) ? (
        orders.length > 0 ? (
          orders.map((order) => (
            <div
              key={order._id}
              className="border border-gray-300 rounded p-4 shadow-sm mb-4"
            >
              <p>
                <strong>Shop Name:</strong> {order.shopName}
              </p>
              <p>
                <strong>Delivery Time:</strong> {order.deliveryTime}
              </p>
              <p>
                <strong>Milk Crates:</strong> Amul: {order.amul}, Gokul:{" "}
                {order.gokul}, Mahananda: {order.mahananda}
              </p>
              <p>
                <strong>Payment Method:</strong> {order.paymentMethod}
              </p>
              <p>
                <strong>Status:</strong> {order.status}
              </p>
            </div>
          ))
        ) : (
          <p>No ongoing orders found.</p>
        )
      ) : (
        <p>Something went wrong. Try logging in again.</p>
      )}
    </div>
  );
};

export default Ongoing;
