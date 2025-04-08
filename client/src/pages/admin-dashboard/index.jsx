// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import { useEffect, useState } from "react";

// const AdminDashboard = () => {
//   const navigate = useNavigate();
//   const [orders, setOrders] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [refresh, setRefresh] = useState(false);

//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     if (!token) navigate("/login");
//   }, []);
//   useEffect(() => {
//     const fetchOrders = async () => {
//       setLoading(true);
//       try {
//         const token = localStorage.getItem("token");

//         const res = await axios.get("/api/admin/orders", {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });

//         console.log("Fetched orders:", res.data);
//         setOrders(res.data);
//       } catch (error) {
//         console.error("Error fetching orders:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchOrders();
//   }, [refresh]);
//   const handleUpdate = async (orderId, field, value) => {
//     console.log(`Updating order: ${orderId}, field: ${field}, value: ${value}`);
//     try {
//       const token = localStorage.getItem("token");
//       await axios.patch(
//         `/api/admin/orders/${orderId}/status`,
//         { [field]: value },
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );
//       setRefresh(!refresh);
//     } catch (err) {
//       console.error("Failed to update order:", err);
//     }
//   };

//   const handleCSVDownload = async () => {
//     console.log("Downloading CSV...");
//     try {
//       const token = localStorage.getItem("token");
//       const res = await axios.get("/api/admin/deliveries/csv", {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//         responseType: "blob",
//       });

//       const url = window.URL.createObjectURL(new Blob([res.data]));
//       const link = document.createElement("a");
//       link.href = url;
//       link.setAttribute("download", "daily-deliveries.csv");
//       document.body.appendChild(link);
//       link.click();
//       link.remove();
//     } catch (err) {
//       console.error("CSV Download failed:", err);
//     }
//   };

//   return (
//     <div className="p-6">
//       <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>

//       <button
//         onClick={handleCSVDownload}
//         className="bg-blue-600 text-white px-4 py-2 rounded mb-4"
//       >
//         Download Daily Deliveries CSV
//       </button>

//       {loading ? (
//         <p>Loading orders...</p>
//       ) : (
//         <div className="overflow-x-auto">
//           <table className="w-full border-collapse border border-gray-300">
//             <thead>
//               <tr className="bg-gray-200">
//                 <th className="border px-4 py-2">Customer</th>
//                 <th className="border px-4 py-2">Address</th>
//                 <th className="border px-4 py-2">Delivery Date</th>
//                 <th className="border px-4 py-2">Amul Buffalo</th>
//                 <th className="border px-4 py-2">Amul Gold</th>
//                 <th className="border px-4 py-2">Amul Taaza</th>
//                 <th className="border px-4 py-2">Gokul Cow</th>
//                 <th className="border px-4 py-2">Gokul Buffalo</th>
//                 <th className="border px-4 py-2">Gokul Full Cream</th>
//                 <th className="border px-4 py-2">Mahananda</th>
//                 <th className="border px-4 py-2">Payment</th>
//                 <th className="border px-4 py-2">Delivery</th>
//                 <th className="border px-4 py-2">Actions</th>
//               </tr>
//             </thead>

//             <tbody>
//               {orders.map((order) => (
//                 <tr key={order._id}>
//                   <td className="border px-4 py-2">{order.shopName}</td>
//                   <td className="border px-4 py-2">{order.address}</td>
//                   <td className="border px-4 py-2">
//                     {new Date(order.deliveryDate).toLocaleDateString("en-IN", {
//                       day: "2-digit",
//                       month: "short",
//                       year: "numeric",
//                     })}
//                   </td>
//                   <td className="border px-4 py-2">
//                     {order.amulBuffaloCrates}
//                   </td>
//                   <td className="border px-4 py-2">{order.amulGoldCrates}</td>
//                   <td className="border px-4 py-2">{order.amulTaazaCrates}</td>
//                   <td className="border px-4 py-2">{order.gokulCowCrates}</td>
//                   <td className="border px-4 py-2">
//                     {order.gokulBuffaloCrates}
//                   </td>
//                   <td className="border px-4 py-2">
//                     {order.gokulFullCreamCrates}
//                   </td>
//                   <td className="border px-4 py-2">{order.mahanandaCrates}</td>
//                   <td className="border px-4 py-2">{order.paymentStatus}</td>
//                   <td className="border px-4 py-2">{order.status}</td>
//                   <td className="border px-4 py-2 space-x-2">
//                     <button
//                       className={`${
//                         order.paymentStatus === "Paid"
//                           ? "bg-red-600"
//                           : "bg-green-600"
//                       } text-white px-2 py-1 rounded`}
//                       onClick={() =>
//                         handleUpdate(
//                           order._id,
//                           "paymentStatus",
//                           order.paymentStatus === "Paid" ? "Unpaid" : "Paid"
//                         )
//                       }
//                     >
//                       {order.paymentStatus === "Paid"
//                         ? "Mark Unpaid"
//                         : "Mark Paid"}
//                     </button>

//                     <button
//                       className={`${
//                         order.status === "Delivered"
//                           ? "bg-red-500"
//                           : "bg-yellow-600"
//                       } text-white px-2 py-1 rounded`}
//                       onClick={() =>
//                         handleUpdate(
//                           order._id,
//                           "status",
//                           order.status === "Delivered" ? "Pending" : "Delivered"
//                         )
//                       }
//                     >
//                       {order.status === "Delivered"
//                         ? "Mark Undelivered"
//                         : "Mark Delivered"}
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       )}
//     </div>
//   );
// };

// export default AdminDashboard;
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
    <div className="p-6 bg-[#f5f7fb] min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-[#38251c]">
        Admin Dashboard
      </h1>

      <button
        onClick={handleCSVDownload}
        className="bg-[#4f83cc] hover:bg-[#3b6ea9] text-white font-medium px-5 py-2 rounded mb-6"
      >
        📥 Download Daily Deliveries CSV
      </button>

      {loading ? (
        <p>Loading orders...</p>
      ) : (
        <div className="overflow-x-auto rounded shadow-md">
          <table className="min-w-full bg-white text-sm text-left border border-gray-200">
            <thead className="bg-[#e9f1fb] text-[#2c3e50] font-semibold">
              <tr>
                <th className="px-4 py-3 border">Customer</th>
                <th className="px-4 py-3 border">Address</th>
                <th className="px-4 py-3 border">Date</th>
                <th className="px-4 py-3 border">Amul Buffalo</th>
                <th className="px-4 py-3 border">Amul Gold</th>
                <th className="px-4 py-3 border">Amul Taaza</th>
                <th className="px-4 py-3 border">Gokul Cow</th>
                <th className="px-4 py-3 border">Gokul Buffalo</th>
                <th className="px-4 py-3 border">Gokul Cream</th>
                <th className="px-4 py-3 border">Mahananda</th>
                <th className="px-4 py-3 border">Payment</th>
                <th className="px-4 py-3 border">Delivery</th>
                <th className="px-4 py-3 border">Actions</th>
              </tr>
            </thead>
            <tbody className="text-[#34495e]">
              {orders.map((order) => (
                <tr key={order._id} className="hover:bg-[#f0f6fd]">
                  <td className="px-4 py-2 border">{order.shopName}</td>
                  <td className="px-4 py-2 border">{order.address}</td>
                  <td className="px-4 py-2 border">
                    {new Date(order.deliveryDate).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                  <td className="px-4 py-2 border">
                    {order.amulBuffaloCrates}
                  </td>
                  <td className="px-4 py-2 border">{order.amulGoldCrates}</td>
                  <td className="px-4 py-2 border">{order.amulTaazaCrates}</td>
                  <td className="px-4 py-2 border">{order.gokulCowCrates}</td>
                  <td className="px-4 py-2 border">
                    {order.gokulBuffaloCrates}
                  </td>
                  <td className="px-4 py-2 border">
                    {order.gokulFullCreamCrates}
                  </td>
                  <td className="px-4 py-2 border">{order.mahanandaCrates}</td>
                  <td className="px-4 py-2 border">{order.paymentStatus}</td>
                  <td className="px-4 py-2 border">{order.status}</td>
                  <td className="px-4 py-2 border space-y-2">
                    <button
                      className={`${
                        order.paymentStatus === "Paid"
                          ? "bg-gray-500"
                          : "bg-[#2ecc71]"
                      } text-white px-3 py-1 rounded w-full`}
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
                          ? "bg-gray-500"
                          : "bg-[#3498db]"
                      } text-white px-3 py-1 rounded w-full`}
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
