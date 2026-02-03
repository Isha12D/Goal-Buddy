import React,{useEffect, useState} from "react";
import { Dialog, DialogActions, DialogContent, DialogTitle, TextField, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";
import { CalendarToday } from "@mui/icons-material"; 
import Navbar from "../Components/Navbar.jsx";
import Goals from "../Components/Goals.jsx";
import Footer from "../Components/Footer.jsx";
import {Link} from 'react-router-dom';
import axios from 'axios';
//import { useAuth } from "../Context/AuthContext.jsx";


const Main = () => {

  const [selectedUser, setSelectedUser] = useState(null);
  const [message, setMessage] = useState('');
  const [user, setUser] = useState(null);
  const {currentUser} = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProtectedData = async () => {
      try {
        const accessToken = localStorage.getItem('accessToken');
        const res = await axios.get('http://localhost:3006/main', {
          headers:{
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setMessage(res.data.message);
        setUser(res.data.user);
      } catch (err) {
        if(err.response && err.response.status === 401){
          console.log('Access token expired. Trying refresh....');
          refreshAccessToken();
        }else{
          console.error('Failed to fetch protected data: ', err);
        }
      }
    }
  });

  const refreshAccessToken = async() => {
    const refreshToken = localStorage.getItem('refreshToken');
    if(!refreshToken) return;

    try {
      const res = await axios.post('http://localhost:3006/token', {
        token: refreshToken,
      });

      const newAccessToken = res.data.accessToken;
      localStorage.setItem('accessToken', newAccessToken);

      const retryRes = await axios.get('http://localhost:3006/main', {
      headers: {
        Authorization: `Bearer ${newAccessToken}`,
      },
    });

    setMessage(retryRes.data.message);
    setUser(retryRes.data.user);
    } catch (err) {
      console.error('Token refresh failed: ', err);
      logout();
      navigate('/');
    }
  }

  const handleFriendsClick = () =>{
    setSelectedUser(currentUser);
    navigate('/display');
  }

  const goalsData = [
    { id: 1, name: "Master a Language", image: "https://i.pinimg.com/736x/c7/15/4b/c7154b20aa547387ea43913c4adcadc9.jpg" },
    { id: 2, name: "Algorithm", image: "https://i.pinimg.com/736x/3c/fb/3d/3cfb3d6154b75cc328c1fd6d1448803b.jpg" },
    { id: 3, name: "Framework/Development", image: "https://i.pinimg.com/736x/41/a7/11/41a711d6a1745b4071cb1930c6cdac9b.jpg" },
    { id: 4, name: "Mini Project/Group Project", image: "https://i.pinimg.com/736x/9f/66/bb/9f66bbd58e32cec9cda7f901a2d11d48.jpg" },
    { id: 5, name: "Hackathon Prep", image: "https://i.pinimg.com/736x/29/01/37/290137c8bd4dba1b211fc5dc42f9445c.jpg" },
    { id: 6, name: "Search Ideas", image: "https://i.pinimg.com/736x/1b/db/fa/1bdbfac2d0fc15e94a1e024ac0286af8.jpg" },
    { id: 7, name: "Daily Streak Coding", image: "https://i.pinimg.com/474x/8b/26/a3/8b26a3fcbe694fe8bcc85bb79e0564df.jpg" },
    { id: 8, name: "Contest Weekly", image: "https://i.pinimg.com/736x/06/50/c7/0650c750aecf30217665824fbf10547b.jpg" },
    { id: 9, name: "Mock Interview", image: "https://i.pinimg.com/736x/44/17/07/441707f8daefade21577cd9061b2d3c5.jpg" },
    { id: 10, name: "Portfolio", image: "https://i.pinimg.com/736x/b0/1c/de/b01cde2b5572f5018e299a96922c7007.jpg" },
    { id: 11, name: "Meet /Group Study", image: "https://i.pinimg.com/736x/f5/02/c5/f502c54ee4662d5ba648cf5e13f9d038.jpg" },
    { id: 12, name: "Communication", image: "https://i.pinimg.com/736x/d0/4d/89/d04d891d778f4613e8c0860ff46825f0.jpg" },
    { id: 13, name: "Tech Comics", image: "https://i.pinimg.com/736x/ac/8b/ba/ac8bba4ecb6473928bfd0b955e37343f.jpg" },
    { id: 14, name: "AI/ML", image: "https://i.pinimg.com/736x/db/7c/19/db7c190693e054346e047d9a4480a838.jpg" },
    { id: 15, name: "Blockchain", image: "https://i.pinimg.com/474x/a6/52/bd/a652bd3cfb5e4378d94d5fa17627dae1.jpg" },
    { id: 16, name: "Others", image: "https://i.pinimg.com/736x/0b/52/af/0b52af13046eb975361af23d83d460fd.jpg" }, 
  ];

  const [selectedGoal, setSelectedGoal] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [goalData, setGoalData] = useState({
    description: "",
    friend: "",
    startDate: "",
    endDate: "",
  });

  const handleGoalClick = (goal) => {
    setSelectedGoal(goal);
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
    setSelectedGoal(null);
  };

  const handleFieldChange = (e) => {
    const { name, value } = e.target;
    setGoalData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    console.log("Goal set:", goalData);
    setGoalData({
      description: "",
      friend: "",
      startDate: "",
      endDate: "",
    });
    handleDialogClose();
  };

  return (
    
    <div className="bg-gray-950 text-white min-h-screen">
      <Navbar/>
      {/* First Strip - heading*/}
      <div className="w-full h-24 p-24 flex items-center justify-center text-4xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-orange-100 to-orange-800">
        Welcome {currentUser?.name || 'User'}, set your goals for today!!
      </div>

      
      {/* Second Strip */}
<div className="w-full flex flex-col md:flex-row justify-around items-center gap-4 md:gap-0 px-4 py-6">
  {/* Profile Box */}
  <div className="bg-red-500 rounded-badge w-full md:w-1/4 p-4 flex flex-col items-center justify-center hover:scale-110 transition-transform duration-300">
    <Link to="/your-profile" className="flex flex-col items-center text-white">
      <img
        src="https://i.pinimg.com/736x/39/42/01/39420149269ede36847932935b26f0b8.jpg"
        alt="Profile"
        className="rounded-full w-20 h-20"
      />
      <p className="mt-2 text-center text-xl">Your Profile</p>
    </Link>
  </div>

  {/* Friends Box */}
  <div className="bg-orange-500 rounded-badge w-full md:w-1/4 p-4 flex flex-col items-center justify-center hover:scale-110 transition-transform duration-300 text-white cursor-pointer" onClick={handleFriendsClick}>
    <img
      src="https://i.pinimg.com/736x/22/47/df/2247dfeadf240a989623cfa1a8355a34.jpg"
      alt="Friends"
      className="rounded-full w-20 h-20"
    />
    <p className="mt-2 text-center text-xl" >Connect with Friends</p>
  </div>
</div>


      {/* Third Section */}
      <Goals socket={''} currentUser={currentUser} selectedUser={''} goalType={"personal"}/>
      <Footer/>
    </div>
    
  );
};

export default Main;
