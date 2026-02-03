import GoalBuddy from "../models/users.js";
import Message from "../models/messages.js";

export const getChatHistory = async (req, res) => {
  const { senderEmail, receiverEmail } = req.params;

  const sender = await GoalBuddy.findOne({ email: senderEmail });
  const receiver = await GoalBuddy.findOne({ email: receiverEmail });

  if (!sender || !receiver) return res.status(404).json("User not found");

  const messages = await Message.find({
    $or: [
      { senderId: sender._id, receiverId: receiver._id },
      { senderId: receiver._id, receiverId: sender._id },
    ]
  }).sort({ createdAt: 1 });

  res.json(messages);
};
