import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../Context/AuthContext";
import Navbar from "./Navbar.jsx";
import Footer from "./Footer.jsx";

const API_URL = import.meta.env.VITE_API_URL;

const YourGoals = () => {
  const { currentUser } = useAuth();
  const [goals, setGoals] = useState([]);

    useEffect(() => {
    if (currentUser?._id) {
      fetchGoals();
    }
  }, [currentUser]);

  const markPersonalGoalIncomplete = async (goalId) => {
    try {
      await axios.put(
      `${API_URL}/goals/mark-goal-incomplete/${goalId}`,
      {},
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    } catch (error) {
      console.error("Error marking goal incomplete:", error);
    }
  };

  const fetchGoals = async () => {
    try {
      let res = await axios.get(
        `${API_URL}/goals/personal/${currentUser._id}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      let fetchedGoals = [...res.data];
      let updated = false;

      // Check if any pending goal has crossed its deadline
      for (const goal of fetchedGoals) {
        if (goal.status === "pending" && isDeadlinePassed(goal)) {
          await markPersonalGoalIncomplete(goal._id);
          updated = true;
        }
      }

      // If any goal was updated to incomplete, fetch fresh data
      if (updated) {
        res = await axios.get(
          `${API_URL}/goals/personal/${currentUser._id}`,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        fetchedGoals = [...res.data];
      }

      // Merge date + time and create sortable timestamp
      const updatedGoals = fetchedGoals.map((goal) => {
        const date = new Date(goal.endDate);

        if (goal.scheduleTime) {
          const [hours, minutes] = goal.scheduleTime
            .split(":")
            .map(Number);

          date.setHours(hours, minutes, 0, 0);
        }

        return {
          ...goal,
          fullDateTime: date.getTime(),
        };
      });

      // MOST RECENT FIRST
      updatedGoals.sort((a, b) => b.fullDateTime - a.fullDateTime);

      setGoals(updatedGoals);

    } catch (error) {
      console.error("Error fetching goals:", error);
    }
  };

  const isDeadlinePassed = (goal) => {
    const deadline = new Date(goal.endDate);

    const [hours, minutes] = goal.scheduleTime
      .split(":")
      .map(Number);

    deadline.setHours(hours, minutes, 0, 0);

    return new Date() > deadline;
  };

  const markAsComplete = async (goal) => {
    try {
      
      if (isDeadlinePassed(goal)) {
          alert("⏰ Deadline has passed!");
          await markPersonalGoalIncomplete(goal._id);
          await fetchGoals(); // refreshes status from backend
          return;
      }
      
      const completionTime = new Date().toISOString(); // Get the current timestamp

  
      const response = await axios.put(
        `${API_URL}/goals/mark-goal-complete/${goal._id}`, 
        { completionTimestamp: completionTime }, // Send timestamp
        { headers: { "Content-Type": "application/json" } }
      );
  
      const updatedGoal = response.data;
  
      setGoals((prevGoals) =>
        prevGoals.map((g) =>
          g._id === goal._id
            ? {
                ...g,
                status: "completed",
                completionTimestamp: updatedGoal.completionTimestamp,
              }
            : g
        )
      );
    } catch (error) {
      console.error("Error marking goal as complete:", error);
    }
  };

  // Nice date + time formatter
  const formatDateTime = (timestamp) => {
    return new Date(timestamp).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  useEffect(() => {
    if (!currentUser?._id) return;

    const timer = setInterval(() => {
      fetchGoals();
    }, 60000);

    return () => clearInterval(timer);
  }, [currentUser]);
    

  return (
    <div>
      <Navbar />
      <h1 className="text-3xl font-bold mb-4 mt-4 text-white">Your Goals</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {goals.map((goal) => (
          <div key={goal._id} className="bg-white shadow-md rounded-lg p-4">
            <img src={goal.image} alt={goal.goal} className="w-full h-40 object-cover rounded-md" />
            <h2 className="text-xl font-semibold mt-2">{goal.goal}</h2>
            <p className="text-gray-600 text-sm mt-1">
              Deadline: {formatDateTime(goal.fullDateTime)}
            </p>
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
            {goal.status === "pending" && !isDeadlinePassed(goal) && (
              <div className="mt-3">
                <input
                  type="checkbox"
                  onChange={() => markAsComplete(goal)}
                  className="mr-2"
                />
                <label>Mark as Completed</label>
              </div>
            )}

          </div>
        ))}
      </div>
      <div className="mt-10">
        <Footer/>
      </div>
    </div>
  );
};

export default YourGoals;
