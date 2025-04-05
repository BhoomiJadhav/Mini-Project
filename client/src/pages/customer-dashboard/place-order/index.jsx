import { useState } from "react";
import { useNavigate } from "react-router-dom";

const PlaceOrder = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [form, setForm] = useState({
    shopName: "",
    address: "",
    deliveryTime: "",
    amulTaazaCrates: 0,
    amulGoldCrates: 0,
    amulBuffaloCrates: 0,
    gokulCowCrates: 0,
    gokulBuffaloCrates: 0,
    gokulFullCreamCrates: 0,
    mahanandaCrates: 0,
    paymentMethod: "COD",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = { ...form };

    if (form.paymentMethod === "ONLINE") {
      alert("Payment simulated successfully. Proceeding with order...");
    }

    try {
      console.log("Token being sent:", token);

      const res = await fetch("http://localhost:5000/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Something went wrong");

      alert(data.message || "Order placed successfully!");
      navigate("/customer-dashboard");
    } catch (error) {
      console.error("Error placing order:", error);
      alert("Order failed: " + error.message);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Place Your Order</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
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
          type="text"
          name="deliveryTime"
          placeholder="Delivery Time (e.g., 4:30 AM)"
          value={form.deliveryTime}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />

        <div className="grid grid-cols-2 gap-4">
          {/* Amul */}
          <input
            type="number"
            name="amulTaazaCrates"
            placeholder="Amul Taaza Crates"
            value={form.amulTaazaCrates}
            onChange={handleChange}
            className="p-2 border rounded w-full"
          />
          <input
            type="number"
            name="amulGoldCrates"
            placeholder="Amul Gold Crates"
            value={form.amulGoldCrates}
            onChange={handleChange}
            className="p-2 border rounded w-full"
          />
          <input
            type="number"
            name="amulBuffaloCrates"
            placeholder="Amul Buffalo Crates"
            value={form.amulBuffaloCrates}
            onChange={handleChange}
            className="p-2 border rounded w-full"
          />

          {/* Gokul */}
          <input
            type="number"
            name="gokulCowCrates"
            placeholder="Gokul Cow Crates"
            value={form.gokulCowCrates}
            onChange={handleChange}
            className="p-2 border rounded w-full"
          />
          <input
            type="number"
            name="gokulBuffaloCrates"
            placeholder="Gokul Buffalo Crates"
            value={form.gokulBuffaloCrates}
            onChange={handleChange}
            className="p-2 border rounded w-full"
          />
          <input
            type="number"
            name="gokulFullCreamCrates"
            placeholder="Gokul Full Cream Crates"
            value={form.gokulFullCreamCrates}
            onChange={handleChange}
            className="p-2 border rounded w-full"
          />

          {/* Mahananda */}
          <input
            type="number"
            name="mahanandaCrates"
            placeholder="Mahananda Crates"
            value={form.mahanandaCrates}
            onChange={handleChange}
            className="p-2 border rounded w-full"
          />
        </div>

        <div className="flex items-center gap-4 mt-4">
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="paymentMethod"
              value="COD"
              checked={form.paymentMethod === "COD"}
              onChange={handleChange}
            />
            Pay at Delivery
          </label>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="paymentMethod"
              value="ONLINE"
              checked={form.paymentMethod === "ONLINE"}
              onChange={handleChange}
            />
            Pay Now
          </label>
        </div>

        <button
          type="submit"
          className="bg-green-600 text-white px-6 py-2 rounded"
        >
          Submit Order
        </button>
      </form>
    </div>
  );
};

export default PlaceOrder;
