import React, { useState } from "react";
import Logo from "../assets/GOAL.png";
import { useAuth } from "../Context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { FiMenu, FiX } from "react-icons/fi"; // Icons for hamburger

const Navbar = ({ toggleLoginForm }) => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
    setIsMobileMenuOpen(false);
  };

  const navLinks = (
    <>
      <li className="text-white hover:text-gray-400 cursor-pointer">
        <Link to="/" onClick={() => setIsMobileMenuOpen(false)}>Home</Link>
      </li>
      <li className="text-white hover:text-gray-400 cursor-pointer">
        <Link to="/about" onClick={() => setIsMobileMenuOpen(false)}>About Us</Link>
      </li>
      <li className="text-white hover:text-gray-400 cursor-pointer">
        <Link to="/reviews" onClick={() => setIsMobileMenuOpen(false)}>Reviews</Link>
      </li>
      {currentUser && (
        <li className="text-white hover:text-gray-400 cursor-pointer">
          <Link to="/your-goals" onClick={() => setIsMobileMenuOpen(false)}>Your Goals</Link>
        </li>
      )}
    </>
  );

  return (
    <nav className="bg-black p-4 h-[60px] shadow-xl shadow-gray-900 sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center h-full">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <img src={Logo} alt="GoalBuddy Logo" className="h-15 w-20 object-contain" />
        </div>

        {/* Hamburger Icon - visible on md and smaller */}
        <div className="md:hidden text-white text-2xl cursor-pointer" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <FiX /> : <FiMenu />}
        </div>

        {/* Desktop Menu */}
        <ul className="hidden md:flex space-x-8 items-center">
          {navLinks}
          {currentUser ? (
            <li className="relative">
              <div
                className="text-white bg-orange-500 w-10 h-10 rounded-full flex items-center justify-center font-bold cursor-pointer"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                {currentUser.name[0].toUpperCase()}
              </div>
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-36 bg-white shadow-md rounded-md">
                  <ul className="py-2 text-gray-700">
                    <li>
                      <Link
                        to="/your-profile"
                        className="block px-4 py-2 hover:bg-gray-200"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        Profile
                      </Link>
                    </li>
                    <li>
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 hover:bg-gray-200"
                      >
                        Logout
                      </button>
                    </li>
                  </ul>
                </div>
              )}
            </li>
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

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-black p-4 space-y-4">
          <ul className="space-y-4">
            {navLinks}
            {currentUser ? (
              <>
                <li>
                  <Link
                    to="/your-profile"
                    className="text-white hover:text-gray-400"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Profile
                  </Link>
                </li>
                <li>
                  <button
                    onClick={handleLogout}
                    className="text-white hover:text-gray-400"
                  >
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <li>
                <button
                  onClick={() => {
                    toggleLoginForm();
                    setIsMobileMenuOpen(false);
                  }}
                  className="text-white border border-orange-500 px-4 py-2 rounded-sm transition-all duration-300 ease-in-out hover:shadow-[0_0_10px_2px_rgba(255,165,0,0.5)]"
                >
                  Login
                </button>
              </li>
            )}
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
