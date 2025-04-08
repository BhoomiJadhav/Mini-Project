// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import toast from "react-hot-toast";
// import { useNavigate } from "react-router-dom";

// const PlaceOrder = () => {
//   const navigate = useNavigate();
//   const [form, setForm] = useState({
//     shopName: "",
//     address: "",
//     deliveryTime: "",
//     deliveryDate: "",
//     amulTaazaCrates: 0,
//     amulGoldCrates: 0,
//     amulBuffaloCrates: 0,
//     gokulCowCrates: 0,
//     gokulBuffaloCrates: 0,
//     gokulFullCreamCrates: 0,
//     mahanandaCrates: 0,
//     paymentMethod: "COD",
//   });

//   const [isEditMode, setIsEditMode] = useState(false);
//   const [orderId, setOrderId] = useState(null);

//   useEffect(() => {
//     const existingOrder = JSON.parse(localStorage.getItem("editOrder"));
//     if (existingOrder) {
//       setForm({
//         shopName: existingOrder.shopName || "",
//         address: existingOrder.address || "",
//         deliveryTime: existingOrder.deliveryTime || "",
//         deliveryDate: existingOrder.deliveryDate?.split("T")[0] || "",
//         amulTaazaCrates: existingOrder.amulTaazaCrates || 0,
//         amulGoldCrates: existingOrder.amulGoldCrates || 0,
//         amulBuffaloCrates: existingOrder.amulBuffaloCrates || 0,
//         gokulCowCrates: existingOrder.gokulCowCrates || 0,
//         gokulBuffaloCrates: existingOrder.gokulBuffaloCrates || 0,
//         gokulFullCreamCrates: existingOrder.gokulFullCreamCrates || 0,
//         mahanandaCrates: existingOrder.mahanandaCrates || 0,
//         paymentMethod: existingOrder.paymentMethod || "COD",
//       });
//       setIsEditMode(true);
//       setOrderId(existingOrder._id);
//     } else {
//       // Reset form if not editing
//       setForm({
//         shopName: "",
//         address: "",
//         deliveryTime: "",
//         deliveryDate: "",
//         amulTaazaCrates: 0,
//         amulGoldCrates: 0,
//         amulBuffaloCrates: 0,
//         gokulCowCrates: 0,
//         gokulBuffaloCrates: 0,
//         gokulFullCreamCrates: 0,
//         mahanandaCrates: 0,
//         paymentMethod: "COD",
//       });
//       setIsEditMode(false);
//       setOrderId(null);
//     }
//   }, []);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setForm((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     try {
//       const token = localStorage.getItem("token");

//       const config = {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       };

//       if (isEditMode && orderId) {
//         await axios.put(
//           `http://localhost:5000/api/orders/${orderId}`,
//           form,
//           config
//         );
//         toast.success("Order updated successfully!");
//       } else {
//         await axios.post(
//           "http://localhost:5000/api/orders/place",
//           form,
//           config
//         );
//         toast.success("Order placed successfully!");
//       }

//       localStorage.removeItem("editOrder");
//       navigate("/customer-dashboard/ongoing");
//     } catch (error) {
//       console.error(error);
//       toast.error("Something went wrong!");
//     }
//   };

//   return (
//     <div className="max-w-2xl mx-auto p-4">
//       <h2 className="text-2xl font-bold mb-4">
//         {isEditMode ? "Edit Order" : "Place Order"}
//       </h2>
//       <form onSubmit={handleSubmit} className="space-y-4">
//         {/* Basic Details */}
//         <input
//           type="text"
//           name="shopName"
//           placeholder="Shop Name"
//           value={form.shopName}
//           onChange={handleChange}
//           className="w-full p-2 border rounded"
//           required
//         />
//         <input
//           type="text"
//           name="address"
//           placeholder="Address"
//           value={form.address}
//           onChange={handleChange}
//           className="w-full p-2 border rounded"
//           required
//         />
//         <input
//           type="time"
//           name="deliveryTime"
//           placeholder="Delivery Time"
//           value={form.deliveryTime}
//           onChange={handleChange}
//           className="w-full p-2 border rounded"
//           required
//         />
//         <input
//           type="date"
//           name="deliveryDate"
//           value={form.deliveryDate}
//           onChange={handleChange}
//           className="w-full p-2 border rounded"
//           required
//         />

//         {/* Milk Crates Inputs */}
//         <div className="grid grid-cols-2 gap-2">
//           <input
//             type="number"
//             name="amulTaazaCrates"
//             placeholder="Amul Taaza Crates"
//             value={form.amulTaazaCrates}
//             onChange={handleChange}
//             className="p-2 border rounded"
//           />
//           <input
//             type="number"
//             name="amulGoldCrates"
//             placeholder="Amul Gold Crates"
//             value={form.amulGoldCrates}
//             onChange={handleChange}
//             className="p-2 border rounded"
//           />
//           <input
//             type="number"
//             name="amulBuffaloCrates"
//             placeholder="Amul Buffalo Crates"
//             value={form.amulBuffaloCrates}
//             onChange={handleChange}
//             className="p-2 border rounded"
//           />
//           <input
//             type="number"
//             name="gokulCowCrates"
//             placeholder="Gokul Cow Crates"
//             value={form.gokulCowCrates}
//             onChange={handleChange}
//             className="p-2 border rounded"
//           />
//           <input
//             type="number"
//             name="gokulBuffaloCrates"
//             placeholder="Gokul Buffalo Crates"
//             value={form.gokulBuffaloCrates}
//             onChange={handleChange}
//             className="p-2 border rounded"
//           />
//           <input
//             type="number"
//             name="gokulFullCreamCrates"
//             placeholder="Gokul Full Cream Crates"
//             value={form.gokulFullCreamCrates}
//             onChange={handleChange}
//             className="p-2 border rounded"
//           />
//           <input
//             type="number"
//             name="mahanandaCrates"
//             placeholder="Mahananda Crates"
//             value={form.mahanandaCrates}
//             onChange={handleChange}
//             className="p-2 border rounded"
//           />
//         </div>

//         {/* Payment */}
//         <select
//           name="paymentMethod"
//           value={form.paymentMethod}
//           onChange={handleChange}
//           className="w-full p-2 border rounded"
//         >
//           <option value="COD">Cash on Delivery</option>
//           <option value="Online">Online</option>
//         </select>

//         <button
//           type="submit"
//           className="w-full bg-[#5b8db7] text-white p-2 rounded hover:bg-[#44789b]"
//         >
//           {isEditMode ? "Update Order" : "Place Order"}
//         </button>
//       </form>
//     </div>
//   );
// };

// export default PlaceOrder;
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

const PlaceOrder = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    shopName: "",
    address: "",
    deliveryTime: "",
    deliveryDate: "",
    amulTaazaCrates: 0,
    amulGoldCrates: 0,
    amulBuffaloCrates: 0,
    gokulCowCrates: 0,
    gokulBuffaloCrates: 0,
    gokulFullCreamCrates: 0,
    mahanandaCrates: 0,
    paymentMethod: "COD",
  });

  const [isEditMode, setIsEditMode] = useState(false);
  const [orderId, setOrderId] = useState(null);

  useEffect(() => {
    const existingOrder = JSON.parse(localStorage.getItem("editOrder"));
    if (existingOrder) {
      setForm({
        shopName: existingOrder.shopName || "",
        address: existingOrder.address || "",
        deliveryTime: existingOrder.deliveryTime || "",
        deliveryDate: existingOrder.deliveryDate?.split("T")[0] || "",
        amulTaazaCrates: existingOrder.amulTaazaCrates || 0,
        amulGoldCrates: existingOrder.amulGoldCrates || 0,
        amulBuffaloCrates: existingOrder.amulBuffaloCrates || 0,
        gokulCowCrates: existingOrder.gokulCowCrates || 0,
        gokulBuffaloCrates: existingOrder.gokulBuffaloCrates || 0,
        gokulFullCreamCrates: existingOrder.gokulFullCreamCrates || 0,
        mahanandaCrates: existingOrder.mahanandaCrates || 0,
        paymentMethod: existingOrder.paymentMethod || "COD",
      });
      setIsEditMode(true);
      setOrderId(existingOrder._id);
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      if (isEditMode && orderId) {
        await axios.put(
          `http://localhost:5000/api/orders/${orderId}`,
          form,
          config
        );
        toast.success("Order updated successfully!");
      } else {
        await axios.post(
          "http://localhost:5000/api/orders/place",
          form,
          config
        );
        toast.success("Order placed successfully!");
      }

      localStorage.removeItem("editOrder");
      navigate("/customer-dashboard/ongoing");
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong!");
    }
  };

  return (
    <div className="flex min-h-screen bg-[#f8f8f8]">
      {/* Sidebar */}
      <div className="w-64 bg-[#4F83CC] text-white p-6 space-y-6 hidden md:block shadow-md">
        <h2 className="text-2xl font-bold">Kumar Milk Distributors</h2>
        <nav className="space-y-4">
          <Link
            to="/customer-dashboard"
            className="block hover:bg-white hover:text-[#4F83CC] px-3 py-2 rounded"
          >
            Dashboard
          </Link>
          <Link
            to="/customer-dashboard/ongoing"
            className="block hover:bg-white hover:text-[#4F83CC] px-3 py-2 rounded"
          >
            Ongoing Orders
          </Link>
          <Link
            to="/customer-dashboard/history"
            className="block hover:bg-white hover:text-[#4F83CC] px-3 py-2 rounded"
          >
            Order History
          </Link>
        </nav>
      </div>

      {/* Main Form Area */}
      <div className="flex-1 p-6">
        <h1 className="text-3xl font-bold text-[#4F83CC] mb-6">
          {isEditMode ? "Edit Order" : "Place New Order"}
        </h1>

        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded-xl shadow space-y-6"
        >
          {/* Basic Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block mb-1 font-semibold">Shop Name</label>
              <input
                type="text"
                name="shopName"
                value={form.shopName}
                onChange={handleChange}
                className="w-full border p-2 rounded"
                required
              />
            </div>

            <div>
              <label className="block mb-1 font-semibold">Address</label>
              <input
                type="text"
                name="address"
                value={form.address}
                onChange={handleChange}
                className="w-full border p-2 rounded"
                required
              />
            </div>

            <div>
              <label className="block mb-1 font-semibold">Delivery Time</label>
              <input
                type="time"
                name="deliveryTime"
                value={form.deliveryTime}
                onChange={handleChange}
                className="w-full border p-2 rounded"
                required
              />
            </div>

            <div>
              <label className="block mb-1 font-semibold">Delivery Date</label>
              <input
                type="date"
                name="deliveryDate"
                value={form.deliveryDate}
                onChange={handleChange}
                className="w-full border p-2 rounded"
                required
              />
            </div>
          </div>

          {/* Crates Section */}
          <div>
            <h2 className="text-xl font-bold mb-2">Milk Crates</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { name: "amulTaazaCrates", label: "Amul Taaza Crates" },
                { name: "amulGoldCrates", label: "Amul Gold Crates" },
                { name: "amulBuffaloCrates", label: "Amul Buffalo Crates" },
                { name: "gokulCowCrates", label: "Gokul Cow Crates" },
                { name: "gokulBuffaloCrates", label: "Gokul Buffalo Crates" },
                {
                  name: "gokulFullCreamCrates",
                  label: "Gokul Full Cream Crates",
                },
                { name: "mahanandaCrates", label: "Mahananda Crates" },
              ].map(({ name, label }) => (
                <div key={name}>
                  <label className="block mb-1 font-medium">{label}</label>
                  <input
                    type="number"
                    name={name}
                    value={form[name]}
                    onChange={handleChange}
                    className="w-full border p-2 rounded"
                    min="0"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Payment */}
          <div>
            <label className="block font-semibold mb-1">Payment Method</label>
            <select
              name="paymentMethod"
              value={form.paymentMethod}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            >
              <option value="COD">Cash on Delivery</option>
              <option value="Online">Online</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full bg-[#4F83CC] text-white p-3 rounded hover:bg-[#83a4c8] transition"
          >
            {isEditMode ? "Update Order" : "Place Order"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PlaceOrder;
