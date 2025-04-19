import { NavLink, useNavigate } from "react-router-dom";

const AdminSidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <aside className="w-64 h-screen bg-[#1e3a8a] text-white flex flex-col justify-between sticky top-0 shadow-md">
      {/* Top section */}
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-10 tracking-wide">Admin Panel</h2>
        <nav className="space-y-3">
          <NavLink
            to="/admin-dashboard/home"
            className={({ isActive }) =>
              `flex items-center gap-2 px-4 py-2 rounded-md transition font-medium ${
                isActive ? "bg-[#3b82f6]" : "hover:bg-[#2563eb]"
              }`
            }
          >
            📊 Dashboard
          </NavLink>
          <NavLink
            to="/admin-dashboard/orders"
            className={({ isActive }) =>
              `flex items-center gap-2 px-4 py-2 rounded-md transition font-medium ${
                isActive ? "bg-[#3b82f6]" : "hover:bg-[#2563eb]"
              }`
            }
          >
            📋 Orders
          </NavLink>
          <NavLink
            to="/admin-dashboard/stocks"
            className={({ isActive }) =>
              `flex items-center gap-2 px-4 py-2 rounded-md transition font-medium ${
                isActive ? "bg-[#3b82f6]" : "hover:bg-[#2563eb]"
              }`
            }
          >
            📦 Inventory
          </NavLink>
        </nav>
      </div>

      {/* Bottom Logout Button */}
      <div className="p-6">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2 px-4 py-2 rounded-md text-white bg-red-500 hover:bg-red-600 transition font-medium"
        >
          🔒 Logout
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
