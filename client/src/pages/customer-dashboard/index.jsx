// import { useNavigate } from "react-router-dom";
// import { useEffect, useState } from "react";

// const CustomerDashboard = () => {
//   const navigate = useNavigate();
//   const [orders, setOrders] = useState([]);

//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     if (!token) navigate("/login");
//     else fetchOngoingOrders();
//   }, []);

//   const fetchOngoingOrders = async () => {
//     try {
//       const res = await fetch("http://localhost:5000/api/orders/ongoing", {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem("token")}`,
//         },
//       });
//       const data = await res.json();
//       setOrders(data);
//     } catch (err) {
//       console.error("Failed to fetch orders:", err);
//     }
//   };

//   return (
//     <div className="flex min-h-screen">
//       {/* Sidebar */}
//       <div className="w-64 bg-[#5b8db7] text-white p-6">
//         <h2 className="text-xl font-bold mb-6">Milk Dashboard</h2>
//         <ul className="space-y-4">
//           <li
//             onClick={() => {
//               localStorage.removeItem("editOrder"); // 💥 clear edit mode
//               navigate("/customer-dashboard/place-order");
//             }}
//             className="cursor-pointer hover:underline"
//           >
//             🛒 Place Order
//           </li>
//           <li
//             onClick={() => navigate("/customer-dashboard/ongoing")}
//             className="cursor-pointer hover:underline"
//           >
//             📦 Ongoing Orders
//           </li>
//           <li
//             onClick={() => navigate("/customer-dashboard/history")}
//             className="cursor-pointer hover:underline"
//           >
//             🕒 Previous Orders
//           </li>
//         </ul>
//       </div>

//       {/* Main Content */}
//       <div className="flex-1 p-10">
//         <h1 className="text-2xl font-bold mb-4">Welcome to your dashboard</h1>
//         <p className="mb-6">Here are your ongoing orders:</p>

//         {orders.length === 0 ? (
//           <p>No ongoing orders</p>
//         ) : (
//           <div className="space-y-4">
//             {orders.map((order) => (
//               <div
//                 key={order._id}
//                 className="border border-gray-300 rounded p-4 shadow-sm"
//               >
//                 <p>
//                   <strong>Shop Name:</strong> {order.shopName}
//                 </p>
//                 <p>
//                   <strong>Delivery Time:</strong> {order.deliveryTime}
//                 </p>
//                 <p>
//                   <strong>Milk Crates:</strong> Amul: {order.amul}, Gokul:{" "}
//                   {order.gokul}, Mahananda: {order.mahananda}
//                 </p>
//                 <p>
//                   <strong>Payment Method:</strong> {order.paymentMethod}
//                 </p>
//                 <p>
//                   <strong>Status:</strong> {order.status}
//                 </p>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default CustomerDashboard;
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const CustomerDashboard = () => {
  const [summary, setSummary] = useState({
    total: 0,
    completed: 0,
    ongoing: 0,
    unpaid: 0,
  });

  const navigate = useNavigate();

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          "http://localhost:5000/api/orders/summary",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setSummary(res.data);
      } catch (err) {
        console.error("Error fetching summary:", err);
      }
    };

    fetchSummary();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-6">Milk Dashboard</h2>

      <ul className="space-y-4 mb-8">
        <li
          onClick={() => {
            localStorage.removeItem("editOrder"); // 💥 clear edit mode
            navigate("/customer-dashboard/place-order");
          }}
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

      <h2 className="text-xl font-bold mb-6">👋 Welcome to your Dashboard</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-blue-100 p-4 rounded shadow">
          <p className="text-gray-700 font-semibold">Total Orders</p>
          <p className="text-2xl font-bold">{summary.total}</p>
        </div>
        <div className="bg-green-100 p-4 rounded shadow">
          <p className="text-gray-700 font-semibold">Completed Orders</p>
          <p className="text-2xl font-bold">{summary.completed}</p>
        </div>
        <div className="bg-yellow-100 p-4 rounded shadow">
          <p className="text-gray-700 font-semibold">Ongoing Orders</p>
          <p className="text-2xl font-bold">{summary.ongoing}</p>
        </div>
        <div className="bg-red-100 p-4 rounded shadow">
          <p className="text-gray-700 font-semibold">Pending Payments</p>
          <p className="text-2xl font-bold">{summary.unpaid}</p>
        </div>
      </div>

      {/* Optionally: Add recent orders, quick actions, announcements, etc. */}
    </div>
  );
};

export default CustomerDashboard;
