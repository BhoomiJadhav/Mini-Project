import React, { useEffect, useState } from "react";

const Ongoing = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOngoing = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/orders/ongoing", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const data = await res.json();
        setOrders(data);
      } catch (err) {
        console.error("Failed to fetch ongoing orders", err);
      }
    };

    fetchOngoing();
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Ongoing Orders (Today)</h2>
      {orders.map((order) => (
        <div key={order._id} className="border p-2 mb-2 rounded">
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
            <strong>Payment:</strong> {order.paymentMode}
          </p>
          <p>
            <strong>Date:</strong> {new Date(order.createdAt).toLocaleString()}
          </p>
        </div>
      ))}
    </div>
  );
};

export default Ongoing;
