// Display.jsx
import React, { useState } from 'react';
import Sidebar from '../Components/Sidebar.jsx';
import Chat from '../Components/Chat.jsx';
import Navbar from '../Components/Navbar.jsx';


const Display = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  return (
    <div>
      <Navbar/>
      <div className="flex h-screen">
      <Sidebar setSelectedUser={setSelectedUser}/>
      <Chat selectedUser={selectedUser}/>
    </div>
    </div>
  );
};

export default Display;
