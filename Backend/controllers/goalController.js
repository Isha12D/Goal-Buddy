import Goal from "../models/goals.js";


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

    const now = new Date();

    // Update expired goals to incomplete
    const updatedGoals = await Promise.all(
      goals.map(async (goal) => {

        if (goal.status === "completed") return goal;

        let endDate = new Date(goal.endDate);

        if (goal.scheduleTime) {
          const [hours, minutes] = goal.scheduleTime.split(":").map(Number);
          endDate.setHours(hours, minutes, 0);
        }

        // If deadline passed → mark incomplete in DB
        if (endDate < now && goal.status !== "incomplete") {
          goal.status = "incomplete";
          await goal.save();
        }

        return goal;
      })
    );

    // Sort newest first
    updatedGoals.sort((a, b) => new Date(b.startDate) - new Date(a.startDate));

    res.json(updatedGoals);

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

    const updatedGoal = await Goal.findByIdAndUpdate(
      goalId,
      {
        status: "completed",
        completionTimestamp
      },
      { new: true }
    );

    if (!updatedGoal) {
      return res.status(404).json({ message: "Goal not found" });
    }

    res.json(updatedGoal);

  } catch (error) {
    console.error("Error marking personal goal complete:", error);
    res.status(500).json({ message: "Failed to update goal" });
  }
};




// 📥 Fetch shared/friends goals
export const getSharedGoals = async (req, res) => {
  try {
    const goals = await Goal.find({ goalType: "friends" })
      .populate("senderId receiverId winner");

    res.json(goals);

  } catch (error) {
    res.status(500).json({ message: "Failed to fetch shared goals" });
  }
};



// ✅ Mark goal complete
export const markComplete = async (req, res) => {
  try {
    const { goalId } = req.params;
    const { winnerId } = req.body;

    const goal = await Goal.findOneAndUpdate(
      { _id: goalId, winner: null },
      { winner: winnerId, status: "completed" },
      { new: true }
    );

    if (!goal) {
      return res.status(400).json({ message: "Already completed" });
    }

    res.json(goal);

  } catch (error) {
    res.status(500).json({ message: "Failed to update goal" });
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

