// import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";

// const PlaceOrder = () => {
//   const navigate = useNavigate();
//   const token = localStorage.getItem("token");

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
//         shopName: existingOrder.shopName,
//         address: existingOrder.address,
//         deliveryTime: existingOrder.deliveryTime,
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
//       // Ensure fresh state if not editing
//       setIsEditMode(false);
//       setOrderId(null);
//       localStorage.removeItem("editOrder");
//     }
//   }, []);
//   const handleNewOrder = () => {
//     localStorage.removeItem("editOrder");
//     navigate("/customer-dashboard/place-order");
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setForm((prev) => ({
//       ...prev,
//       [name]: name.includes("Crates") ? parseInt(value) : value,
//     }));
//   };

//   //
//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const payload = { ...form };

//     if (form.paymentMethod === "ONLINE") {
//       alert("Payment simulated successfully. Proceeding with order...");
//     }

//     try {
//       const url = isEditMode
//         ? `http://localhost:5000/api/orders/${orderId}`
//         : "http://localhost:5000/api/orders";

//       const method = isEditMode ? "PUT" : "POST";

//       const res = await fetch(url, {
//         method,
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify(payload),
//       });

//       const data = await res.json();

//       if (!res.ok) throw new Error(data.message || "Something went wrong");

//       if (isEditMode) {
//         alert(data.message || "Order updated successfully.");
//         localStorage.removeItem("editOrder");
//       } else {
//         alert(data.message || "Order placed successfully.");
//       }

//       navigate("/customer-dashboard/ongoing");
//     } catch (error) {
//       console.error("Error submitting order:", error.message);
//       alert("Error: " + error.message);
//     }
//   };

//   return (
//     <div className="p-6 max-w-2xl mx-auto">
//       <h2 className="text-2xl font-bold mb-4">
//         {isEditMode ? "✏️ Edit Order" : "📝 Place New Order"}
//       </h2>
//       <form onSubmit={handleSubmit} className="space-y-4">
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
//           type="text"
//           name="deliveryTime"
//           placeholder="Delivery Time (e.g., 4:30 AM)"
//           value={form.deliveryTime}
//           onChange={handleChange}
//           className="w-full p-2 border rounded"
//           required
//         />
//         <label className="block mb-2 text-sm font-medium">Delivery Date</label>
//         <input
//           type="date"
//           value={form.deliveryDate}
//           onChange={(e) => setForm({ ...form, deliveryDate: e.target.value })}
//           className="w-full p-2 border rounded"
//         />

//         <div className="grid grid-cols-2 gap-4">
//           {/* Amul */}
//           <input
//             type="number"
//             name="amulTaazaCrates"
//             placeholder="Amul Taaza Crates"
//             value={form.amulTaazaCrates}
//             onChange={handleChange}
//             className="p-2 border rounded w-full"
//           />
//           <input
//             type="number"
//             name="amulGoldCrates"
//             placeholder="Amul Gold Crates"
//             value={form.amulGoldCrates}
//             onChange={handleChange}
//             className="p-2 border rounded w-full"
//           />
//           <input
//             type="number"
//             name="amulBuffaloCrates"
//             placeholder="Amul Buffalo Crates"
//             value={form.amulBuffaloCrates}
//             onChange={handleChange}
//             className="p-2 border rounded w-full"
//           />

//           {/* Gokul */}
//           <input
//             type="number"
//             name="gokulCowCrates"
//             placeholder="Gokul Cow Crates"
//             value={form.gokulCowCrates}
//             onChange={handleChange}
//             className="p-2 border rounded w-full"
//           />
//           <input
//             type="number"
//             name="gokulBuffaloCrates"
//             placeholder="Gokul Buffalo Crates"
//             value={form.gokulBuffaloCrates}
//             onChange={handleChange}
//             className="p-2 border rounded w-full"
//           />
//           <input
//             type="number"
//             name="gokulFullCreamCrates"
//             placeholder="Gokul Full Cream Crates"
//             value={form.gokulFullCreamCrates}
//             onChange={handleChange}
//             className="p-2 border rounded w-full"
//           />

//           {/* Mahananda */}
//           <input
//             type="number"
//             name="mahanandaCrates"
//             placeholder="Mahananda Crates"
//             value={form.mahanandaCrates}
//             onChange={handleChange}
//             className="p-2 border rounded w-full"
//           />
//         </div>

//         <div className="flex items-center gap-4 mt-4">
//           <label className="flex items-center gap-2">
//             <input
//               type="radio"
//               name="paymentMethod"
//               value="COD"
//               checked={form.paymentMethod === "COD"}
//               onChange={handleChange}
//             />
//             Pay at Delivery
//           </label>
//           <label className="flex items-center gap-2">
//             <input
//               type="radio"
//               name="paymentMethod"
//               value="ONLINE"
//               checked={form.paymentMethod === "ONLINE"}
//               onChange={handleChange}
//             />
//             Pay Now
//           </label>
//         </div>

//         <button
//           type="submit"
//           className="bg-green-600 text-white px-6 py-2 rounded"
//         >
//           {isEditMode ? "Update Order" : "Place Order"}
//         </button>
//       </form>
//     </div>
//   );
// };

// export default PlaceOrder;
import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

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
    } else {
      // Reset form if not editing
      setForm({
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
      setIsEditMode(false);
      setOrderId(null);
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
    <div className="max-w-2xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">
        {isEditMode ? "Edit Order" : "Place Order"}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Basic Details */}
        <input
          type="text"
          name="shopName"
          placeholder="Shop Name"
          value={form.shopName}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="text"
          name="address"
          placeholder="Address"
          value={form.address}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="time"
          name="deliveryTime"
          placeholder="Delivery Time"
          value={form.deliveryTime}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="date"
          name="deliveryDate"
          value={form.deliveryDate}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />

        {/* Milk Crates Inputs */}
        <div className="grid grid-cols-2 gap-2">
          <input
            type="number"
            name="amulTaazaCrates"
            placeholder="Amul Taaza Crates"
            value={form.amulTaazaCrates}
            onChange={handleChange}
            className="p-2 border rounded"
          />
          <input
            type="number"
            name="amulGoldCrates"
            placeholder="Amul Gold Crates"
            value={form.amulGoldCrates}
            onChange={handleChange}
            className="p-2 border rounded"
          />
          <input
            type="number"
            name="amulBuffaloCrates"
            placeholder="Amul Buffalo Crates"
            value={form.amulBuffaloCrates}
            onChange={handleChange}
            className="p-2 border rounded"
          />
          <input
            type="number"
            name="gokulCowCrates"
            placeholder="Gokul Cow Crates"
            value={form.gokulCowCrates}
            onChange={handleChange}
            className="p-2 border rounded"
          />
          <input
            type="number"
            name="gokulBuffaloCrates"
            placeholder="Gokul Buffalo Crates"
            value={form.gokulBuffaloCrates}
            onChange={handleChange}
            className="p-2 border rounded"
          />
          <input
            type="number"
            name="gokulFullCreamCrates"
            placeholder="Gokul Full Cream Crates"
            value={form.gokulFullCreamCrates}
            onChange={handleChange}
            className="p-2 border rounded"
          />
          <input
            type="number"
            name="mahanandaCrates"
            placeholder="Mahananda Crates"
            value={form.mahanandaCrates}
            onChange={handleChange}
            className="p-2 border rounded"
          />
        </div>

        {/* Payment */}
        <select
          name="paymentMethod"
          value={form.paymentMethod}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        >
          <option value="COD">Cash on Delivery</option>
          <option value="Online">Online</option>
        </select>

        <button
          type="submit"
          className="w-full bg-[#5b8db7] text-white p-2 rounded hover:bg-[#44789b]"
        >
          {isEditMode ? "Update Order" : "Place Order"}
        </button>
      </form>
    </div>
  );
};

export default PlaceOrder;
