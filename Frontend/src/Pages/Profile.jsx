import React, { useState } from "react";
import { motion } from "framer-motion";
import Navbar from "../Components/Navbar";
import YourProfile from "../Components/YourProfile";
import FriendProfile from "../Components/FriendProfile";
import Footer from "../Components/Footer";

const Profile = () => {
  const [activeTab, setActiveTab] = useState("personal");

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col">
        <Navbar/>
      {/* Top Image */}
      <div className="h-44 w-full flex justify-center items-center mt-3">
        <img
          src="https://i.pinimg.com/736x/7e/89/82/7e8982c4c38d31c6e3b5db72cd46e131.jpg"
          alt="Banner"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Toggle Bar */}
      <div className="w-full flex relative">
        {/* Toggle Background */}
        <motion.div
          className="absolute bottom-0 h-1 bg-gray-700 w-1/2 transition-all duration-100 ease-in-out"
          animate={{ x: activeTab === "friends" ? "100%" : "0%" }}
        />

        {/* Personal Button */}
        <button
          className={`w-1/2 text-center py-2 text-lg font-semibold ${
            activeTab === "personal" ? "text-orange-400" : "text-gray-400"
          }`}
          onClick={() => setActiveTab("personal")}
        >
          Personal
        </button>

        {/* Friends Button */}
        <button
          className={`w-1/2 text-center py-2 text-lg font-semibold ${
            activeTab === "friends" ? "text-orange-400" : "text-gray-400"
          }`}
          onClick={() => setActiveTab("friends")}
        >
          Friends
        </button>
      </div>

      {/* Content Section */}
      <motion.div
        className="flex-1 p-6"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -50 }}
        key={activeTab} // Ensures animation re-renders
      >
        {activeTab === "personal" ? (
          <div className="text-center text-xl"><YourProfile/></div>
        ) : (
          <div className="text-center text-xl"><FriendProfile/></div>
        )}
      </motion.div>
      <div className="mt-10">
        <Footer />
      </div>
    </div>
    
  );
};

export default Profile;
