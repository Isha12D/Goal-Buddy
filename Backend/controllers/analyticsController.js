import mongoose from "mongoose";
import Goal from "../models/goals.js";

// 📊 Top 5 most completed PERSONAL goals
export const getTopCompletedGoals = async (req, res) => {
  try {
    const { userId } = req.params;

    const topGoals = await Goal.aggregate([
      {
        $match: {
          senderId: new mongoose.Types.ObjectId(userId),
          status: "completed",
          goalType: "personal"
        }
      },
      {
        $group: {
          _id: "$goal",
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]);

    res.json(topGoals);

  } catch (error) {
    console.error("Error fetching top completed goals:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};



// 📊 Top 5 most INCOMPLETE PERSONAL goals
export const getTopIncompleteGoals = async (req, res) => {
  try {
    const { userId } = req.params;

    const topIncompleteGoals = await Goal.aggregate([
      {
        $match: {
          senderId: new mongoose.Types.ObjectId(userId),
          status: "incomplete",
          goalType: "personal"
        }
      },
      {
        $group: {
          _id: "$goal",
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]);

    res.json(topIncompleteGoals);

  } catch (error) {
    console.error("Error fetching top incomplete goals:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


export const topWinners = async (req, res) => {
  const winners = await Goal.aggregate([
    { $match: { status: "completed", goalType: "friends" } },
    { $group: { _id: "$winner", count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 3 }
  ]);

  res.json(winners);
};

export const userRank = async (req, res) => {
  const { userId } = req.params;

  const stats = await Goal.aggregate([
    { $match: { status: "completed", goalType: "friends" } },
    { $group: { _id: "$winner", count: { $sum: 1 } } },
    { $sort: { count: -1 } }
  ]);

  const rank = stats.findIndex(u => u._id.toString() === userId) + 1;

  res.json({ rank });
};

// Total completed goals by a user (friends goals only)
export const getCompletedGoalsCount = async (req, res) => {
  try {
    const { userId } = req.params;

    const completedGoalsCount = await Goal.countDocuments({
      winner: userId,
      status: 'completed',
      goalType: 'friends'
    });

    res.status(200).json({
      completedGoals: completedGoalsCount
    });
  } catch (error) {
    console.error('❌ Error fetching completed goals:', error);
    res.status(500).json({ 
      message: 'Internal Server Error' 
    });
  }
};
