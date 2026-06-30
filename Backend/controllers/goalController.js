import Goal from "../models/goals.js";
import GoalBuddy from "../models/users.js";

// ➕ Create goal (personal or friends)
export const createGoal = async (req, res) => {
  try {
    const {
      senderId,
      goalType,
      goal,
      description,
      startDate,
      endDate,
      image,
      scheduleTime,
      sentTimestamp,
    } = req.body;

    if (
      !senderId ||
      !goalType ||
      !goal ||
      !description ||
      !startDate ||
      !endDate ||
      !scheduleTime
    ) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const newGoal = await Goal.create({
      senderId,
      goalType,
      goal,
      description,
      startDate,
      endDate,
      image,
      scheduleTime,
      sentTimestamp,
    });

    res.status(201).json({
      message: "Goal saved successfully",
      goal: newGoal,
    });

  } catch (error) {
    console.error("Error saving goal:", error);
    res.status(500).json({ message: "Failed to save goal" });
  }
};



// 📥 Fetch PERSONAL goals of a user
export const getPersonalGoals = async (req, res) => {
  try {
    const { userId } = req.params;

    const goals = await Goal.find({
      senderId: userId,
      goalType: "personal",
    });

    goals.sort((a, b) => new Date(b.startDate) - new Date(a.startDate));

    res.json(goals);

  } catch (error) {
    console.error("Failed to fetch personal goals:", error);
    res.status(500).json({ message: "Failed to fetch personal goals" });
  }
};


// ✅ Mark PERSONAL goal as completed
export const markPersonalGoalComplete = async (req, res) => {
  try {
    const { goalId } = req.params;
    const { completionTimestamp } = req.body;

    const goal = await Goal.findById(goalId);

    if (!goal) {
      return res.status(404).json({
        message: "Goal not found",
      });
    }

    // Already completed or expired
    if (goal.status !== "pending") {
      return res.status(400).json({
        message: "Goal already completed or expired",
      });
    }

    // Build deadline
    const deadline = new Date(goal.endDate);

    const [hours, minutes] = goal.scheduleTime
      .split(":")
      .map(Number);

    deadline.setHours(hours, minutes, 0, 0);

    // Deadline crossed
    if (new Date() > deadline) {
      goal.status = "incomplete";
      await goal.save();

      return res.status(400).json({
        message: "Deadline passed",
      });
    }

    goal.status = "completed";
    goal.completionTimestamp = completionTimestamp;

    await goal.save();

    res.json(goal);

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to update goal",
    });
  }
};

// ✅ Mark PERSONAL goal as incomplete (deadline passed)
export const markPersonalGoalFailed = async (req, res) => {
  try {
    const { goalId } = req.params;

    const goal = await Goal.findById(goalId);

    if (!goal) {
      return res.status(404).json({
        message: "Goal not found",
      });
    }

    // Already completed or already incomplete
    if (
      goal.status === "completed" ||
      goal.status === "incomplete"
    ) {
      return res.json(goal);
    }

    // Build deadline
    const deadline = new Date(goal.endDate);

    const [hours, minutes] = goal.scheduleTime
      .split(":")
      .map(Number);

    deadline.setHours(hours, minutes, 0, 0);

    // Only mark incomplete if deadline passed
    if (new Date() > deadline) {
      goal.status = "incomplete";
      await goal.save();
    }

    res.json(goal);

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to update goal",
    });
  }
};



// 📥 Fetch shared/friends goals
// export const getSharedGoals = async (req, res) => {
//   try {
//     const goals = await Goal.find({ goalType: "friends" })
//       .populate("senderId receiverId winner");

//     res.json(goals);

//   } catch (error) {
//     res.status(500).json({ message: "Failed to fetch shared goals" });
//   }
// };

export const getSharedGoals = async (req, res) => {
  try {
    const { senderEmail, receiverEmail } = req.params;

    const sender = await GoalBuddy.findOne({ email: senderEmail });
    const receiver = await GoalBuddy.findOne({ email: receiverEmail });

    if (!sender || !receiver) {
      return res.status(404).json({ message: "Users not found" });
    }

    const goals = await Goal.find({
      goalType: "friends",
      $or: [
        {
          senderId: sender._id,
          receiverId: receiver._id,
        },
        {
          senderId: receiver._id,
          receiverId: sender._id,
        },
      ],
    }).populate("winner", "name")
    .sort({ createdAt: 1 });

    const now = new Date();

    for(const goal of goals){
      if (
          goal.status === "completed" ||
          goal.status === "failed" ||
          goal.winner ||
          goal.completionTimestamp
      ) {
          continue;
      }
      const deadline = new Date(goal.endDate);

      const [hours, minutes] = goal.scheduleTime.split(":").map(Number);
      deadline.setHours(hours, minutes, 0, 0);
      if(now > deadline){
        goal.status = 'failed';
        await goal.save();
      }
    }

    res.json(goals);
  } catch (error) {
  console.error("🔥 FULL BACKEND ERROR:", error);

  res.status(500).json({
    message: "Failed to fetch shared goals",
    error: error.message,
  });
}
};



// ✅ Mark goal complete
export const markComplete = async (req, res) => {
  const io = req.app.get("io");

  const { goalId } = req.params;
  const { winnerId } = req.body;

  try {
    console.log("REQ BODY:", req.body);

    // Only update goals that are still pending
    const updatedGoal = await Goal.findOneAndUpdate(
      {
        _id: goalId,
        goalType: "friends",
        status: "pending",      // 👈 important
        winner: null,           // 👈 safety check
      },
      {
        $set: {
          winner: winnerId,
          status: "completed",
          completionTimestamp: new Date(),
        },
      },
      { new: true }
    );

    if (!updatedGoal) {
      return res.status(400).json({
        message: "Goal is already completed or failed.",
      });
    }

    io.emit("goal-completed", {
      goalId: updatedGoal._id,
      winnerId,
      status: "completed",
    });

    res.json({
      message: "Goal marked as complete",
      goal: updatedGoal,
    });

  } catch (error) {
    console.error("Error marking goal complete:", error);
    res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};

//Mark goal as failed
export const markFailed = async (req, res) => {
  try {

    const io = req.app.get("io");
    const { goalId } = req.params;

    const goal = await Goal.findById(goalId);

    if (!goal) {
      return res.status(404).json({
        message: "Goal not found",
      });
    }

    // ✅ Already completed?
    if (
      goal.status === "completed" ||
      goal.winner ||
      goal.completionTimestamp
    ) {
      return res.status(400).json({
        message: "Goal already completed",
      });
    }

    goal.status = "failed";
    await goal.save();

    io.emit("goal-failed", {
      goalId,
      status: "failed",
    });

    res.json(goal);

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed",
    });
  }
};

// 📌 Get goal ID between two users at a specific time
export const getGoalId = async (req, res) => {
  try {
    const { currentUserId, selectedUserId, scheduleTime } = req.query;

    const filter = {
      $or: [
        { senderId: currentUserId, receiverId: selectedUserId },
        { senderId: selectedUserId, receiverId: currentUserId },
      ],
      scheduleTime: scheduleTime,
    };

    const goal = await Goal.findOne(filter).select("_id");

    if (!goal) {
      console.log("❌ No goal matched.");
      return res
        .status(404)
        .json({ message: "No goals found matching the criteria" });
    }

    console.log("✅ Goal found:", goal);

    // Keeping array format as your frontend expects
    res.json([goal]);

  } catch (error) {
    console.error("❌ Error fetching goal:", error);
    res.status(500).json({ message: "Server Error", error });
  }
};



// Find Goal
//    ↓
// Build Deadline
//    ↓
// Deadline Passed?
//    ↓
// YES --------------------> status = failed
//                             save
//                             io.emit("goal-failed")
//                             return

// NO
//    ↓
// Update Winner
//    ↓
// io.emit("goal-completed")
//    ↓
// res.json(...)