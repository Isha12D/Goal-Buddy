import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../Context/AuthContext";
import Navbar from "./Navbar.jsx";

const YourGoals = () => {
  const { currentUser } = useAuth();
  const [goals, setGoals] = useState([]);

  useEffect(() => {
    if (currentUser?._id) {
      fetchGoals();
    }
  }, [currentUser]);

  const fetchGoals = async () => {
    try {
      const res = await axios.get(`http://localhost:3006/personal-goals/${currentUser._id}`, {
        headers: { "Content-Type": "application/json" },
      });
  
      const today = new Date();
  
      const updatedGoals = res.data.map((goal) => {
        let endDate = new Date(goal.endDate);
        
        if (goal.scheduleTime) {
          const [hours, minutes] = goal.scheduleTime.split(":").map(Number);
          endDate.setHours(hours, minutes, 0);
        }
  
        console.log(`Goal: ${goal.goal} | EndTime: ${endDate} | CurrentTime: ${today}`);
  
        if (!isNaN(endDate.getTime()) && endDate < today && goal.status !== "completed") {
          return { ...goal, status: "incomplete" };
        }
        return goal;
      });
  
      setGoals(updatedGoals);
    } catch (error) {
      console.error("Error fetching goals:", error);
    }
  };
  

  const markAsComplete = async (goalId) => {
    try {
      await axios.put(`http://localhost:3006/mark-goal-complete/${goalId}`, {}, {
        headers: { "Content-Type": "application/json" },
      });

      setGoals(goals.map((goal) => 
        goal._id === goalId ? { ...goal, status: "completed" } : goal
      ));
      
    } catch (error) {
      console.error("Error marking goal as complete:", error);
    }
  };

  return (
    <div>
      <Navbar />
      <h1 className="text-3xl font-bold mb-4 mt-4 text-white">Your Goals</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {goals.map((goal) => (
          <div key={goal._id} className="bg-white shadow-md rounded-lg p-4">
            <img src={goal.image} alt={goal.goal} className="w-full h-40 object-cover rounded-md" />
            <h2 className="text-xl font-semibold mt-2">{goal.goal}</h2>
            <p className="text-gray-600 text-sm">Start Date: {goal.startDate}</p>
            <p className="text-gray-600 text-sm">End Date: {goal.endDate}</p>
            <p
              className={`text-sm mt-2 font-medium ${
                goal.status === "completed"
                  ? "text-green-500"
                  : goal.status === "incomplete"
                  ? "text-red-500"
                  : "text-yellow-500"
              }`}
            >
              {goal.status === "completed"
                ? "Completed"
                : goal.status === "incomplete"
                ? "Incomplete"
                : "Pending"}
            </p>

            {/* Show checkbox only for pending goals within the deadline */}
            {(goal.status === "pending") && (
              <div className="mt-3">
                <input
                  type="checkbox"
                  onChange={() => markAsComplete(goal._id)}
                  className="mr-2"
                />
                <label>Mark as Completed</label>
              </div>
            )}

          </div>
        ))}
      </div>
    </div>
  );
};

export default YourGoals;
