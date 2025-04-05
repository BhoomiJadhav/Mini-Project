import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const CustomerDashboard = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) navigate("/login");
    else fetchOngoingOrders();
  }, []);

  const fetchOngoingOrders = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/orders/ongoing", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await res.json();
      setOrders(data);
    } catch (err) {
      console.error("Failed to fetch orders:", err);
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <div className="w-64 bg-[#5b8db7] text-white p-6">
        <h2 className="text-xl font-bold mb-6">Milk Dashboard</h2>
        <ul className="space-y-4">
          <li
            onClick={() => navigate("/customer-dashboard/place-order")}
            className="cursor-pointer hover:underline"
          >
            🛒 Place Order
          </li>
          <li
            onClick={() => navigate("/customer-dashboard/ongoing")}
            className="cursor-pointer hover:underline"
          >
            📦 Ongoing Orders
          </li>
          <li
            onClick={() => navigate("/customer-dashboard/history")}
            className="cursor-pointer hover:underline"
          >
            🕒 Previous Orders
          </li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-10">
        <h1 className="text-2xl font-bold mb-4">Welcome to your dashboard</h1>
        <p className="mb-6">Here are your ongoing orders:</p>

        {orders.length === 0 ? (
          <p>No ongoing orders</p>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order._id}
                className="border border-gray-300 rounded p-4 shadow-sm"
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
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerDashboard;
