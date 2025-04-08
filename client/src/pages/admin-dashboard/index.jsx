import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) navigate("/login");
  }, []);
  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");

        const res = await axios.get("/api/admin/orders", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log("Fetched orders:", res.data);
        setOrders(res.data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [refresh]);
  const handleUpdate = async (orderId, field, value) => {
    console.log(`Updating order: ${orderId}, field: ${field}, value: ${value}`);
    try {
      const token = localStorage.getItem("token");
      await axios.patch(
        `/api/admin/orders/${orderId}/status`,
        { [field]: value },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setRefresh(!refresh);
    } catch (err) {
      console.error("Failed to update order:", err);
    }
  };

  const handleCSVDownload = async () => {
    console.log("Downloading CSV...");
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("/api/admin/deliveries/csv", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "daily-deliveries.csv");
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error("CSV Download failed:", err);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>

      <button
        onClick={handleCSVDownload}
        className="bg-blue-600 text-white px-4 py-2 rounded mb-4"
      >
        Download Daily Deliveries CSV
      </button>

      {loading ? (
        <p>Loading orders...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="border px-4 py-2">Customer</th>
                <th className="border px-4 py-2">Address</th>
                <th className="border px-4 py-2">Delivery Date</th>
                <th className="border px-4 py-2">Amul Buffalo</th>
                <th className="border px-4 py-2">Amul Gold</th>
                <th className="border px-4 py-2">Amul Taaza</th>
                <th className="border px-4 py-2">Gokul Cow</th>
                <th className="border px-4 py-2">Gokul Buffalo</th>
                <th className="border px-4 py-2">Gokul Full Cream</th>
                <th className="border px-4 py-2">Mahananda</th>
                <th className="border px-4 py-2">Payment</th>
                <th className="border px-4 py-2">Delivery</th>
                <th className="border px-4 py-2">Actions</th>
              </tr>
            </thead>

            <tbody>
              {orders.map((order) => (
                <tr key={order._id}>
                  <td className="border px-4 py-2">{order.shopName}</td>
                  <td className="border px-4 py-2">{order.address}</td>
                  <td className="border px-4 py-2">
                    {new Date(order.deliveryDate).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                  <td className="border px-4 py-2">
                    {order.amulBuffaloCrates}
                  </td>
                  <td className="border px-4 py-2">{order.amulGoldCrates}</td>
                  <td className="border px-4 py-2">{order.amulTaazaCrates}</td>
                  <td className="border px-4 py-2">{order.gokulCowCrates}</td>
                  <td className="border px-4 py-2">
                    {order.gokulBuffaloCrates}
                  </td>
                  <td className="border px-4 py-2">
                    {order.gokulFullCreamCrates}
                  </td>
                  <td className="border px-4 py-2">{order.mahanandaCrates}</td>
                  <td className="border px-4 py-2">{order.paymentStatus}</td>
                  <td className="border px-4 py-2">{order.status}</td>
                  <td className="border px-4 py-2 space-x-2">
                    <button
                      className={`${
                        order.paymentStatus === "Paid"
                          ? "bg-red-600"
                          : "bg-green-600"
                      } text-white px-2 py-1 rounded`}
                      onClick={() =>
                        handleUpdate(
                          order._id,
                          "paymentStatus",
                          order.paymentStatus === "Paid" ? "Unpaid" : "Paid"
                        )
                      }
                    >
                      {order.paymentStatus === "Paid"
                        ? "Mark Unpaid"
                        : "Mark Paid"}
                    </button>

                    <button
                      className={`${
                        order.status === "Delivered"
                          ? "bg-red-500"
                          : "bg-yellow-600"
                      } text-white px-2 py-1 rounded`}
                      onClick={() =>
                        handleUpdate(
                          order._id,
                          "status",
                          order.status === "Delivered" ? "Pending" : "Delivered"
                        )
                      }
                    >
                      {order.status === "Delivered"
                        ? "Mark Undelivered"
                        : "Mark Delivered"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
