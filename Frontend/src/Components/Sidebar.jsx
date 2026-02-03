import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext';
import { FaSearch } from 'react-icons/fa';  // Importing magnifying glass icon from react-icons

const Sidebar = ({setSelectedUser}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);

  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();

  // Extracting user initials (for profile picture)
  const userInitials = currentUser ? currentUser.name?.split(' ').map(word => word[0]).join('') : 'ID';

  const toggleDropdown = () => setDropdownOpen((prev) => !prev);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch('http://localhost:3006/user');
        const data = await res.json();
        const filteredUsers = data.filter(user => user.email !== currentUser.email);
        setUsers(filteredUsers);
      } catch (err) {
        setError("Could not load users.");
      }
    };
    fetchUsers();
  }, [currentUser]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Filtering users based on search query
  //console.log(currentUser._id);
  const filteredUsers = users.filter(user =>
    
    
    user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleUserClick = (user) => {
    setSelectedUser(user); // Update the selected user in Display state
  };

  return (
    <div className="w-full h-screen flex flex-col shadow-lg relative bg-gray-950 border-gray-900 border-2">
      {/* User Info Section */}
      <div className="flex items-center justify-between bg-orange-500 p-4 shadow-md rounded-btn mb-4">
        <div className="w-12 h-12 flex items-center justify-center rounded-full border-2 border-white overflow-hidden">
          <img 
            src={currentUser?.profilePic}
            alt="Profile" 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex flex-col ml-2">
          <span className="text-lg text-white font-semibold">{currentUser ? currentUser.name : "User Name"}</span>
        </div>
        <button className="text-white focus:outline-none" onClick={toggleDropdown}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fillRule="evenodd" d="M10 4a2 2 0 100 4 2 2 0 000-4zm0 6a2 2 0 100 4 2 2 0 000-4zm0 6a2 2 0 100 4 2 2 0 000-4z" clipRule="evenodd" />
          </svg>
        </button>
      </div>

      {dropdownOpen && (
        <div ref={dropdownRef} className="absolute top-16 right-8 w-40 bg-white text-black rounded-md shadow-lg z-10">
          <ul className="list-none bg-gray-950 rounded-md p-2">
            <li className="p-2 hover:bg-gray-800 text-gray-300">
              <Link to="/profile">My Profile</Link>
            </li>
            <li className="p-2 hover:bg-gray-800 text-gray-300">
              <Link to="/settings">Requests</Link>
            </li>
            <li className="p-2 hover:bg-gray-800 text-gray-300">
              <button onClick={handleLogout}>Logout</button>
            </li>
          </ul>
        </div>
      )}

      {/* Search Bar Section */}
      <div className="px-4 mt-4 bg-gray-950 border-gray-600 ">
        <div className="flex items-center border-2 border-gray-500 rounded-full bg-gray-950 px-3 py-2 mb-3">
          <FaSearch className="text-gray-300" />
          <input
            type="text"
            placeholder="Search users..."
            className="w-full ml-2 outline-none"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* User List Section */}
      <div className="sidebar p-4 overflow-y-auto">
        {error && <p className="text-red-500">{error}</p>}
        <ul>
          {filteredUsers.length > 0 ? (
            filteredUsers.map(user => (
              <li 
                key={user._id} 
                className="flex items-center justify-between p-1 m-3 bg-gray-950 border-2 border-gray-700 border-t-0 rounded-badge hover:bg-gray-900 cursor-default  shadow-md mb-3"
                onClick={() => handleUserClick(user)} // Select user on click
              >
                <div className="flex items-center space-x-3">
                  <img 
                    src={user?.profilePic || 'https://i.pinimg.com/736x/9a/56/bf/9a56bf771d2252298b02afb5fca68511.jpg'} 
                    alt="avatar" 
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <p className="text-lg font-normal">{user.name}</p>
                  </div>
                </div>
              </li>
            ))
          ) : (
            <p>No users found</p>
          )}
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
