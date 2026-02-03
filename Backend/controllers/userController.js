import GoalBuddy from "../models/users.js";
import Message from "../models/messages.js";
import Goal from "../models/goals.js";
import bcrypt from "bcryptjs";

// GET all users
export const getAllUsers = async (req, res) => {
  const users = await GoalBuddy.find();
  res.json(users);
};

// GET user by email
export const getUserByEmail = async (req, res) => {
  const user = await GoalBuddy.findOne({ email: req.params.email });

  if (!user) {
    return res.status(404).json({ message: "Not found" });
  }

  res.json(user);
};

// UPDATE profile
export const updateProfile = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const userId = req.user.id;  // NOW THIS WILL WORK ✅

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const user = await GoalBuddy.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (name) user.name = name;
    if (email) user.email = email;

    if (password) {
      user.password = await bcrypt.hash(password, 10);
    }

    if (req.file) {
      user.profilePic = req.file.path;
    }

    await user.save();

    res.json({ message: "Updated successfully", user });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};


// DELETE user
export const deleteUser = async (req, res) => {
  const userId = req.params.id;

  await GoalBuddy.findByIdAndDelete(userId);

  await Message.deleteMany({
    $or: [{ senderId: userId }, { receiverId: userId }],
  });

  await Goal.deleteMany({
    $or: [{ senderId: userId }, { receiverId: userId }],
  });

  res.json({ message: "Deleted" });
};
