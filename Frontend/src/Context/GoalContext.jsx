// GoalContext.jsx
import React, { createContext, useState, useContext } from 'react';

const GoalContext = createContext();

export const useGoal = () => useContext(GoalContext);

export const GoalProvider = ({ children }) => {
    const [goalData, setGoalData] = useState({
        description: "",
        startDate: "",
        endDate: "",
        scheduleTime: "",
    });
    const [timestamp, setTimestamp] = useState(null);

    return (
        <GoalContext.Provider value={{  goalData, setGoalData, timestamp, setTimestamp }}>
            {children}
        </GoalContext.Provider>
    );
};
