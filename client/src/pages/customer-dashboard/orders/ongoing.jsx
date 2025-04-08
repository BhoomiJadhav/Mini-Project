import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Ongoing = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

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
        setOrders(res.data);
      } catch (error) {
        console.error(
          "Error fetching orders:",
          error.response?.data || error.message
        );
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const isBeforeDeliveryBuffer = (deliveryDate, deliveryTime) => {
    const now = new Date();
    const deliveryDateTime = new Date(deliveryDate);
    const [hours, minutes] = deliveryTime.split(":").map(Number);
    deliveryDateTime.setHours(hours, minutes, 0, 0);
    const bufferTime = new Date(
      deliveryDateTime.getTime() - 2 * 60 * 60 * 1000
    );
    return now < bufferTime;
  };

  const handleEdit = (order) => {
    localStorage.setItem("editOrder", JSON.stringify(order));
    navigate("/customer-dashboard/place-order");
  };

  const handleDelete = async (orderId, deliveryDate, deliveryTime) => {
    if (!isBeforeDeliveryBuffer(deliveryDate, deliveryTime)) {
      alert("You can only delete the order before 2 hours of delivery.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/orders/${orderId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setOrders(orders.filter((o) => o._id !== orderId));
      alert("Order deleted successfully.");
    } catch (error) {
      console.error(
        "Error deleting order:",
        error.response?.data || error.message
      );
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-60 bg-[#4F83CC] text-white p-6">
        <h1 className="text-2xl font-bold mb-6">Customer</h1>
        <nav className="space-y-4">
          <button
            onClick={() => navigate("/customer-dashboard")}
            className="block w-full text-left hover:text-[#83a4c8] p-2 rounded"
          >
            📦 Place Order
          </button>
          <button
            onClick={() => navigate("/customer-dashboard/ongoing")}
            className="block w-full text-left hover:text-[#83a4c8] p-2 rounded"
          >
            📋 Ongoing Orders
          </button>
          <button
            onClick={() => navigate("/customer-dashboard/history")}
            className="block w-full text-left hover:text-[#83a4c8] p-2 rounded"
          >
            📚 Order History
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <h2 className="text-2xl font-semibold mb-6 ">📋 Ongoing Orders</h2>

        {loading ? (
          <p>Loading...</p>
        ) : Array.isArray(orders) ? (
          orders.length > 0 ? (
            <div className="space-y-6">
              {orders.map((order) => (
                <div
                  key={order._id}
                  className="bg-white p-6 rounded-xl shadow hover:shadow-md transition"
                >
                  <div className="grid sm:grid-cols-2 gap-3 text-gray-700">
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
                    <p>
                      <strong>Delivery Date:</strong>{" "}
                      {new Date(order.deliveryDate).toLocaleDateString()}
                    </p>
                  </div>

                  {isBeforeDeliveryBuffer(
                    order.deliveryDate,
                    order.deliveryTime
                  ) && (
                    <div className="mt-4 flex gap-4">
                      <button
                        onClick={() => handleEdit(order)}
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                      >
                        ✏️ Edit
                      </button>
                      <button
                        onClick={() =>
                          handleDelete(
                            order._id,
                            order.deliveryDate,
                            order.deliveryTime
                          )
                        }
                        className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p>No ongoing orders found.</p>
          )
        ) : (
          <p>Something went wrong. Try logging in again.</p>
        )}
      </main>
    </div>
  );
};

export default Ongoing;
