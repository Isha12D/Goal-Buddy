import mongoose from "mongoose";

const GoalSchema = new mongoose.Schema({
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "GoalBuddy",
    required: true,
  },

  receiverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "GoalBuddy",
    default: null,
  },

  goalType: {
    type: String,
    enum: ["personal", "friends"],
    required: true,
  },

  goal: {
    type: String,
    required: true,
  },

  description: {
    type: String,
    required: true,
  },

  startDate: {
    type: Date,
    required: true,
  },

  endDate: {
    type: Date,
    required: true,
  },

  image: {
    type: String,
  },

  scheduleTime: {
    type: String,
    required: true,
  },

  status: {
    type: String,
    enum: ["pending", "completed", "failed", "incomplete"],
    default: "pending",
  },

  winner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "GoalBuddy",
    default: null,
  },

  sentTimestamp: {
    type: Date,
  },

  completionTimestamp: {
    type: Date,
    default: null,
  },
});

const Goal = mongoose.model("Goal", GoalSchema);

export default Goal;
