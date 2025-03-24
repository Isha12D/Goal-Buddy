import React from "react";
import Logo from "../assets/GOAL.png";
import { useAuth } from "../Context/AuthContext";
import {Link, useNavigate} from 'react-router-dom'

const Navbar = ({ toggleLoginForm }) => {
  const {currentUser} = useAuth();
  return (
    <nav className="bg-black p-4 h-[60px] shadow-xl shadow-gray-900 sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center h-full">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <img
            src={Logo}
            alt="GoalBuddy Logo"
            className="h-15 w-20 object-contain"
          />
        </div>
        {/* Menu items */}
        {/* Menu items */}
        <ul className="flex space-x-8 md:space-x-12 items-center">
          <li className="text-white hover:text-gray-400 cursor-pointer">Home</li>
          <li className="text-white hover:text-gray-400 cursor-pointer">About Us</li>
          <li className="text-white hover:text-gray-400 cursor-pointer">Reviews</li>
          {currentUser ? (
            <>
              <li className="text-white hover:text-gray-400 cursor-pointer">
                <Link to="/your-goals"> Your Goals</Link>
              </li>
              <li>
                <div className="text-white bg-orange-500 w-10 h-10 rounded-full flex items-center justify-center font-bold">
                  {currentUser.name[0].toUpperCase()} {/* Display user initials */}
                </div>
              </li>
            </>
          ) : (
            <li>
              <button
                onClick={toggleLoginForm}
                className="text-white border border-orange-500 px-4 py-2 rounded-sm transition-all duration-300 ease-in-out hover:shadow-[0_0_10px_2px_rgba(255,165,0,0.5)]"
              >
                Login
              </button>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
