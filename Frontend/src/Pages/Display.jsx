// Display.jsx
import React, { useState } from 'react';
import Sidebar from '../Components/Sidebar.jsx';
import Chat from '../Components/Chat.jsx';
import Navbar from '../Components/Navbar.jsx';
import Footer from '../Components/Footer.jsx';


const Display = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  return (
    <div>
      <Navbar/>
      <div className="flex h-screen">
      <div
        className={`w-full sm:w-1/3 md:w-1/4 border-r 
        ${selectedUser ? "hidden sm:block" : "block"}`}
      >
        <Sidebar setSelectedUser={setSelectedUser} />
      </div>
      <div
        className={`flex-1 
        ${selectedUser ? "block" : "hidden sm:block"}`}
      >
        <Chat selectedUser={selectedUser} onBack={() => setSelectedUser(null)}/>
      </div>
    </div>
    <Footer/>
    </div>
  );
};

export default Display;
