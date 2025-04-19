import { Outlet } from "react-router-dom";
import AdminSidebar from "../Components/AdminSidebar";

const AdminLayout = () => {
  return (
    <div className="flex bg-[#f5f7fb] min-h-screen">
      <AdminSidebar />
      <main className="flex-1 p-6 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
