import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const CustomerDashboard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) navigate("/login");
  }, []);

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
        <h1 className="text-2xl font-bold">Welcome to your dashboard</h1>
        <p>Select an option from the sidebar to get started.</p>
      </div>
    </div>
  );
};

export default CustomerDashboard;
