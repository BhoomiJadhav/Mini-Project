import React from "react";

const MilkPrices = () => {
  const milkProducts = [
    {
      brand: "Amul Milk Products",
      items: [
        { name: "Amul Taaza 500ml (24 pack)", price: "₹633.24" },
        { name: "Amul Taaza 1L (12 pack)", price: "₹620.64" },
        { name: "Amul Buffalo Milk 500ml (24 pack)", price: "₹812.40" },
        { name: "Amul Cow Milk 500ml (24 pack)", price: "₹627.00" },
        { name: "Amul T-Special 500ml (24 pack)", price: "₹633.24" },
      ],
    },
    {
      brand: "Gokul Milk Products",
      items: [
        { name: "Full Cream Milk 1L Pouch", price: "₹72.00" },
        { name: "Buffalo Milk 500ml Pouch", price: "₹36.00" },
        { name: "Cow Milk Satvik 500ml", price: "₹36.00" },
      ],
    },
    {
      brand: "Mahanand Milk Products",
      items: [
        { name: "Annapurna Toned Milk 1L", price: "₹56.00" },
        { name: "Toned Milk 1L", price: "₹55.00" },
        { name: "Cow Milk 1L", price: "₹57.00" },
      ],
    },
  ];

  return (
    <div className="bg-white min-h-screen flex flex-col items-center justify-center p-6 ">
      <div className="max-w-4xl bg-[#ededed] shadow-lg rounded-2xl p-8 text-center border-[#83a4c8] border-[10px]">
        <h1 className="text-3xl font-bold text-[#6c4836] mb-6">Milk Prices</h1>

        {milkProducts.map((category, index) => (
          <div key={index} className="mb-6">
            <h2 className="text-2xl font-semibold text-[#6c4836] border-b-2 border-[#83a4c8] pb-1">
              {category.brand}
            </h2>
            <ul className="mt-3 space-y-2">
              {category.items.map((item, i) => (
                <li
                  key={i}
                  className="flex justify-between bg-white p-3 rounded-lg shadow-sm border-l-4 border-[#6c4836]"
                >
                  <span className="text-gray-700 font-medium">{item.name}</span>
                  <span className="text-[#d7382e] font-semibold">
                    {item.price}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MilkPrices;
