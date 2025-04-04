import React from "react";
import backgroundImage from "../assets/back.png";
import logo from "../assets/logo.png";
import milk from "../assets/milk.png";

import { useNavigate } from "react-router-dom";
import AboutUs from "./About";
import OrderInstructions from "./OrderInstruction";
import MilkPrices from "./Products";
import ContactUs from "./contactus";

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen border-[#83a4c8] border-[10px]">
      <div className="relative min-h-screen flex flex-col items-center bg-cover bg-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-15"
          style={{ backgroundImage: `url(${backgroundImage})` }}
        ></div>

        {/* Navbar */}
        <div className="w-full flex items-center justify-center px-7 relative pt-2">
          <img src={logo} alt="Organic Milk Logo" className="w-30 h-30" />
          <div className="absolute right-10 flex space-x-4">
            <button
              className="bg-transparent border border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white px-4 py-2 rounded-lg"
              onClick={() => navigate("/login")}
            >
              Login
            </button>
            <button
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
              onClick={() => navigate("/register")}
            >
              Register
            </button>
          </div>
        </div>

        {/* Hero Section */}
        <div className="max-w-6xl flex flex-col md:flex-row items-center justify-between relative z-10">
          {/* Left Content */}
          <div className="md:w-1/2 text-center md:text-left space-y-6">
            <h1 className="text-6xl font-bold text-[#6c4836] leading-tight">
              100% Fresh <br /> Organic Milk
            </h1>
            <p className="text-gray-600 text-lg">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </p>
            <button className="bg-[#54a9f7] hover:bg-blue-600 text-white font-semibold py-4 px-10 rounded-xl shadow-md text-lg">
              Learn More
            </button>
          </div>

          {/* Right Image */}
          <div className="w-[900px] flex justify-center relative md:mt-0">
            <img
              src={milk}
              alt="Organic Milk Bottles"
              className="w-[900px] max-w-full object-contain"
            />
          </div>
        </div>

        {/* Wave Effect */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none">
          <svg
            viewBox="0 0 1200 120"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="none"
            className="w-full h-24 fill-white"
          >
            <path d="M0,96L80,80C160,64,320,32,480,32C640,32,800,64,960,74.7C1120,85,1280,75,1360,70.7L1440,64V120H0Z"></path>
          </svg>
        </div>
      </div>

      <div className=" ">
        <AboutUs />
      </div>
      <div>
        <OrderInstructions />
        <MilkPrices />
        <ContactUs />
      </div>
      <footer className="text-center bg-blue-100 p-5">
        <p>&copy; 2025 Kumar Milk Distributors. All Rights Reserved.</p>
      </footer>
    </div>
  );
};

export default LandingPage;
