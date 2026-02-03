import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../Context/AuthContext";
import { Pie, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale, LinearScale, BarElement, Title
} from "chart.js";
import CalendarHeatmap from "react-calendar-heatmap";
import "react-calendar-heatmap/dist/styles.css";
import moment from "moment";
//import { Tooltip } from "react-tooltip"; --> name conflicts
//import ReactTooltip from "react-tooltip"; ---> supports v5+ ...something like that
import { Tooltip as ReactTooltip } from "react-tooltip";
import {FiEdit2} from 'react-icons/fi';
import EditProfile from "../Pages/EditProfile";



// Register chart elements
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

const YourProfile = () => {
  const { currentUser } = useAuth();
  const [goals, setGoals] = useState([]);
  const [tooltip, setTooltip] = useState({ visible: false, date: "", x: 0, y: 0 });
  const [topGoals, setTopGoals] = useState([]);
  const [topIncompleteGoals, setTopIncompleteGoals] = useState([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);


  useEffect(() => {
    if (currentUser?._id) {
      fetchGoals();
    }
  }, [currentUser]);

  useEffect(() => {
    if (currentUser?._id) {
      fetchTopGoals();
      fetchTopIncompleteGoals();
    }
  }, [currentUser]);

  const fetchTopGoals = async () => {
    try {
      const response = await axios.get(`http://localhost:3006/analytics/top-completed-goals/${currentUser?._id}`);
      setTopGoals(response.data);
    } catch (error) {
      console.error("Error fetching top completed goals:", error);
    }
  };

  const fetchTopIncompleteGoals = async () => {
    try {
      const response = await axios.get(`http://localhost:3006/analytics/top-incomplete-goals/${currentUser?._id}`);
      setTopIncompleteGoals(response.data);
    } catch (error) {
      console.error("Error fetching top incomplete goals:", error);
    }
  };
  

  const fetchGoals = async () => {
    try {
      const res = await axios.get(`http://localhost:3006/goals/personal/${currentUser?._id}`, {
        headers: { "Content-Type": "application/json" },
      });
      setGoals(res.data || []);
    } catch (error) {
      console.error("Error fetching goals:", error);
    }
  };

  // ANALYTICS: Count goals by status
  const completedGoals = goals.filter((goal) => goal.status === "completed").length;
  const pendingGoals = goals.filter((goal) => goal.status === "pending").length;
  const incompleteGoals = goals.filter((goal) => goal.status === "incomplete").length;

  // Pie Chart Data
  const pieData = {
    labels: ["Completed", "Pending", "Incomplete"],
    datasets: [
      {
        data: [completedGoals, pendingGoals, incompleteGoals],
        backgroundColor: ["#FF8C00", "#FF4500", "#FFA500"],
        borderColor: "black",
        borderWidth: 0,
      },
    ],
  };

  // // Heatmap Data
  const today = moment();
  const lastYear = moment().subtract(365, "days");

  // Create a map of goal dates
  const goalDates = new Set(goals.map((goal) => moment(goal.startDate).format("YYYY-MM-DD")));

  // Generate all 365 days
  const heatmapData = [];
  for (let m = lastYear; m.isSameOrBefore(today); m.add(1, "day")) {
    heatmapData.push({
      date: m.format("YYYY-MM-DD"),
      count: goalDates.has(m.format("YYYY-MM-DD")) ? 1 : 0, // Mark filled days
    });
  }

  const barData = {
    labels: topGoals.map((goal) => goal._id), // Goal names
    datasets: [
      {
        label: "Top Completed Goals",
        data: topGoals.map((goal) => goal.count), // Goal completion count
        backgroundColor: ["#FF8C00", "#FF4500", "#FFA500", "#FFD700", "#FF6347"],
        borderColor: "black",
        borderWidth: 1,
      },
    ],
  };

  const barDataIncomplete = {
    labels: topIncompleteGoals.map((goal) => goal._id), // Goal names
    datasets: [
      {
        label: "Top Incomplete Goals",
        data: topIncompleteGoals.map((goal) => goal.count), // Goal incomplete count
        backgroundColor: ["#800080", "#8A2BE2", "#9370DB", "#BA55D3", "#DDA0DD"], // Purple-Violet color scheme
        borderColor: "black",
        borderWidth: 1,
      },
    ],
  };
  
  
  const getCurrentStreak = () => {
    let currentStreak = 0;
    let longestStreak = 0;
    let streakOngoing = true;
    
    for (let m = moment(); m.isAfter(lastYear); m.subtract(1, "day")) {
      const dateStr = m.format("YYYY-MM-DD");
  
      if (goalDates.has(dateStr)) {
        if (streakOngoing) {
          currentStreak++;
        }
        longestStreak = Math.max(longestStreak, currentStreak);
      } else {
        streakOngoing = false; // Break the streak
      }
    }
    
    return currentStreak;
  };
  
  const currentStreak = getCurrentStreak();
  

  return (
    <div className="p-6">
      {/* User Info Section */}
      <div className="flex flex-col items-center mb-6">
        <div className="relative group">
          <img 
            src={currentUser.profilePic}
            alt="User Avatar" 
            className="w-24 h-24 rounded-full border-4 border-gray-300 shadow-lg object-cover"
          />
          {/* Pencil Button overlay */}
          <button
            onClick={() => setIsEditModalOpen(true)}
            className="absolute bottom-1 right-1 bg-black p-1 rounded-full shadow hover:bg-gray-800 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          >
            <FiEdit2 className="text-white w-5 h-5" />
          </button>
        </div>
        <h2 className="text-2xl font-semibold mt-2 bg-gradient-to-r from-orange-500 to-orange-700 text-transparent bg-clip-text">
          {currentUser?.name}
        </h2>
      </div>

      {/* Flex container for Pie Chart & Heatmap */}
      <div className="flex flex-col lg:flex-row gap-6 justify-center">
        {/* Pie Chart: Goal Completion Analysis (30% Width) */}
        <div className="w-full lg:w-[30%] h-[400px] bg-gray-800 shadow-xl p-4 rounded-lg flex items-center justify-center relative flex-col">
          <h2 className="text-xl  text-white  ">
            Goal Completion Analysis
          </h2>
          <div className="">
            <Pie data={pieData} />
          </div>
        </div>

        {/* Heatmap: Goal Tracking (70% Width) */}
        <div className="w-full lg:w-[70%] bg-gray-800 shadow-xl p-4 rounded-lg mt-6 lg:mt-0">
          <h2 className="text-xl  text-white text-center mb-4 mt-6">
            Goal Streak Heatmap
          </h2>
  
          <CalendarHeatmap
            startDate={moment().subtract(365, "days").toDate()}
            endDate={moment().toDate()}
            values={heatmapData}
            classForValue={(value) => (value?.count ? "color-filled" : "color-empty")}
            onMouseOver={(event, value) => {
              if (value && value.date) {
                setTooltip({
                  visible: true,
                  date: moment(value.date).format("DD MMM, YYYY"),
                  x: event.clientX + 10,
                  y: event.clientY + 10,
                });
              }
            }}
            onMouseLeave={() => setTooltip({ ...tooltip, visible: false })}
          />

          {tooltip.visible && (
            <div
              className="absolute bg-black text-white text-sm px-2 py-1 rounded"
              style={{
                top: tooltip.y,
                left: tooltip.x,
                position: "fixed",
                zIndex: 1000,
                pointerEvents: "none",
              }}
            >
              {tooltip.date}
            </div>
          )}

          {/* Display Current Streak */}
          <div className="text-white text-center mt-4 text-lg font-semibold">
            🔥 Current Streak: {currentStreak} days
          </div>
      </div>
    </div>

      {/* Custom Heatmap Styles */}
      <style>
        {`
          .react-calendar-heatmap .color-empty {
            fill: #31362e; /* Dark gray */
          }
          .react-calendar-heatmap .color-filled {
            fill: #378709; /* Green */
            filter: drop-shadow(0px 0px 10px #00ff00); /* Glow Effect */
          }
        `}
      </style>

      {/* Bar Graph: Top Completed Goals */}
      <div className="w-[100%] h-[400px] bg-gray-800 shadow-xl p-4 rounded-lg flex items-center justify-center flex-col mt-8">
        <h2 className="text-xl text-white mb-4">Completed Goals</h2>
        <Bar data={barData} />
      </div>

      {/* Bar Graph: Top Incomplete Goals */}
      <div className="w-[100%] h-[400px] bg-gray-800 shadow-xl p-4 rounded-lg flex items-center justify-center flex-col mt-8">
        <h2 className="text-xl text-white mb-4">Incomplete Goals</h2>
        <Bar data={barDataIncomplete} />
      </div>


      {/*  Modal for edit profile  */}
      {isEditModalOpen && 
        (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-gray-900 p-8 rounded-lg text-sm shadow-lg w-full max-w-md relative">
              <button
                className="absolute top-2 right-2 text-white hover:text-gray-400"
                onClick={() => setIsEditModalOpen(false)}
              >
                ✖
              </button>
              <EditProfile
                userFromState={currentUser}
                onClose={() => setIsEditModalOpen(false)}
              />
            </div>
          </div>
        )}

      
    </div>
  );
};

export default YourProfile;
