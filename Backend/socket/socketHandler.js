import GoalBuddy from "../models/users.js";
import Message from "../models/messages.js";
import Goal from "../models/goals.js";

const users = {};

const socketHandler = (io) => {

  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("register", (userName) => {
      users[userName] = socket.id;
    });

    // Chat message
    socket.on("user-message", async (message) => {
      const sender = await GoalBuddy.findOne({ name: message.user });
      const receiver = await GoalBuddy.findOne({ name: message.receiverSocketId });

      if (!sender || !receiver) return;

      const newMessage = new Message({
        senderId: sender._id,
        receiverId: receiver._id,
        text: message.text,
      });

      await newMessage.save();

      const receiverSocket = users[message.receiverSocketId];

      if (receiverSocket) {
        io.to(receiverSocket).emit("message", message);
      }

      socket.emit("message", message);
    });

    // Goals socket
    socket.on("goalMessage", async (goalMessage) => {
      const sender = await GoalBuddy.findOne({ name: goalMessage.user });
      const receiver = await GoalBuddy.findOne({ name: goalMessage.receiverSocketId });

      if (!sender || !receiver) return;

      const newGoal = new Goal({
        senderId: sender._id,
        receiverId: receiver._id,
        goal: goalMessage.goal.name,
        description: goalMessage.goal.description,
        startDate: goalMessage.goal.startDate,
        endDate: goalMessage.goal.endDate,
        scheduleTime: goalMessage.goal.scheduleTime,
        image: goalMessage.goal.image,
        goalType: goalMessage.goal.goalType,
        sentTimestamp: goalMessage.goal.timestamp,
      });

      await newGoal.save();

      const receiverSocket = users[goalMessage.receiverSocketId];

      if (receiverSocket) {
        io.to(receiverSocket).emit("goalMessage", goalMessage);
      }

      socket.emit("goalMessage", goalMessage);
    });

    socket.on("disconnect", () => {
      for (const user in users) {
        if (users[user] === socket.id) delete users[user];
      }
    });
  });

};

export default socketHandler;
