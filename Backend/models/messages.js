const mongoose = require('mongoose');
const GoalBuddy = require('./users.js'); // Assuming GoalBuddy is the user model

const MessageSchema = new mongoose.Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'GoalBuddy', // Reference to the 'GoalBuddy' collection
      required: true,
    },
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'GoalBuddy', // Reference to the 'GoalBuddy' collection
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const Message = mongoose.model('Message', MessageSchema);
module.exports = Message;
