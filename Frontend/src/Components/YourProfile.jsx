import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../Context/AuthContext";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import CalendarHeatmap from "react-calendar-heatmap";
import "react-calendar-heatmap/dist/styles.css";

// Register chart elements
ChartJS.register(ArcElement, Tooltip, Legend);

const YourProfile = () => {
  const { currentUser } = useAuth();
  const [goals, setGoals] = useState([]);

  useEffect(() => {
    if (currentUser?._id) {
      fetchGoals();
    }
  }, [currentUser]);

  const fetchGoals = async () => {
    try {
      const res = await axios.get(`http://localhost:3006/personal-goals/${currentUser?._id}`, {
        headers: { "Content-Type": "application/json" },
      });
      setGoals(res.data);
      console.log("Personal goals fetched:", res.data);
    } catch (error) {
      console.error("Error fetching goals:", error);
    }
  };

  // ANALYTICS: Count goals by status
  const completedGoals = goals.filter((goal) => goal.status === "completed").length;
  const pendingGoals = goals.filter((goal) => goal.status === "pending").length;
  const incompleteGoals = goals.filter((goal) => goal.status === "incomplete").length;

  // Track Streaks
  const completedDates = goals
    .filter((goal) => goal.status === "completed" && goal.completionTimestamp)
    .map((goal) => new Date(goal.completionTimestamp).toISOString().split("T")[0]); // Extract date only

  const calculateStreak = () => {
    const dates = completedDates.map(date => new Date(date).getTime()).sort((a, b) => a - b);
    let streak = 0;
    let maxStreak = 0;

    for (let i = 1; i < dates.length; i++) {
      if (dates[i] - dates[i - 1] === 86400000) { // 1 day difference
        streak++;
        maxStreak = Math.max(maxStreak, streak);
      } else {
        streak = 0;
      }
    }
    return maxStreak + 1;
  };

  const streakCount = calculateStreak();

  // Pie Chart Data
  const pieData = {
    labels: ["Completed", "Pending", "Incomplete"],
    datasets: [
      {
        data: [completedGoals, pendingGoals, incompleteGoals],
        backgroundColor: ["#4CAF50", "#FFC107", "#FF5252"],
      },
    ],
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Your Profile</h1>

      {/* User Information */}
      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <h2 className="text-2xl font-semibold">Welcome, {currentUser?.name}</h2>
        <p className="text-gray-600">Email: {currentUser?.email}</p>
      </div>

      {/* Goal Completion Analytics */}
      <div className="flex justify-center items-center my-6">
        <div className="w-72 h-72">
          <h2 className="text-xl font-semibold mb-2 text-center">Goal Completion Analysis</h2>
          <Pie data={pieData} />
        </div>
      </div>

      {/* Calendar Heatmap */}
      <div className="bg-white shadow-md rounded-lg p-6 mt-6">
        <h2 className="text-xl font-semibold mb-4">Goal Completion Calendar</h2>
        <CalendarHeatmap
          startDate={new Date(new Date().setFullYear(new Date().getFullYear() - 1))}
          endDate={new Date()}
          values={completedDates.map(date => ({ date, count: 1 }))}
          classForValue={(value) => {
            if (!value) return "color-empty";
            return `color-scale-${value.count}`;
          }}
        />
      </div>

      {/* Streak Message */}
      {streakCount >= 10 && (
        <div className="bg-green-500 text-white text-lg p-4 rounded-lg mt-6 text-center">
          🎉 You’ve been consistent for {streakCount} days! Keep it up! 🚀
        </div>
      )}
    </div>
  );
};

export default YourProfile;
