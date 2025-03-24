const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const GoalBuddy = require('./models/users.js');
const Message = require('./models/messages.js');
const Goal = require('./models/goals.js');
const { generateAccessToken, generateRefreshToken, authenticateUser } = require('./middleware/auth.js');
const http = require('http')
const {Server} = require('socket.io');
const app = express();
const server = http.createServer(app);
require('dotenv').config();

app.use(express.json());
app.use(cors({
    origin: '*',
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization']
}));

mongoose.connect(process.env.MONGODB_URI, {
    //useNewUrlParser: true,
    //useUnifiedTopology: true
})
.then(() => console.log('MongoDB Atlas connected!!'))
.catch(err => console.error('MongoDB connection ERROR:', err));

//Socket.io connection
// const io = new Server(server, {
//     cors:{
//         origin: 'http://localhost:5174',
//         methods: ['GET','POST']
//     }
// });

// io.on('connection', (socket) => {
//     //console.log('A new user has connected', socket.id); 
//     socket.on('user-message', (message) => {
//         console.log('A new User message', message); 
//         io.emit('message', message);
//     });
// });


//Socket.io connection
const io = new Server(server, {
    cors: {
      origin: 'http://localhost:5174',
      methods: ['GET', 'POST'],
    },
});

let users = {};

// Socket.io connection
io.on('connection', (socket) => {
  console.log('A user has connected: ' + socket.id);

  // Register the user
  socket.on('register', (userName) => {
    //console.log(`${userName} registered with socket ID: ${socket.id}`);
    users[userName] = socket.id; // Save username with socket ID
  });

  
  //   socket.on('goalMessage', async (goalMessage) => {
  //     console.log('Goal message received:', goalMessage);
      
  //     try{
  //       const sender = await GoalBuddy.findOne({name: goalMessage.user});
  //       const receiver = goalMessage.receiver ? await GoalBuddy.findOne({ name: goalMessage.receiverSocketId }) : null;

  //       if (!sender) {
  //         console.log('Sender not found');
  //         return;
  //       }
  //       // Create a new goal entry or append to an existing goal
  //       const newGoal = new Goal({
  //         senderId: sender._id,
  //         receiverId:  receiver._id || null ,
  //         goal: goalMessage.goal.name,
  //         description: goalMessage.goal.text, // Save the message text
  //         startDate: goalMessage.goal.startDate, // Populate required fields
  //         endDate: goalMessage.goal.endDate,
  //         scheduleTime: goalMessage.goal.scheduleTime,
  //       });

  //     await newGoal.save();
  //     console.log('Goal message saved to database');

  //     // Forward the goal message to the receiver
  //     const receiverSocketId = users[receiver.name];
  //     if (receiverSocketId) {
  //       io.to(receiverSocketId).emit('goalMessage', {
  //         user: sender.name,
  //         goal: goalMessage.goal,
  //         timestamp: goalMessage.timestamp,
  //       });
  //       console.log('Goal message sent to receiver:', receiver.name);
  //     } else {
  //       console.log('Recipient is not connected');
  //     }

  //     // Always send the message back to the sender as well
  //     socket.emit('goalMessage', {
  //       user: sender.name,
  //       goal: goalMessage.goal,
  //       timestamp: goalMessage.timestamp,
  //     });

  //   } catch (err) {
  //       console.error('Error handling goalMessage:', err);
  //   }   
  // });

  //working fine
  socket.on('goalMessage', async (goalMessage) => {
    console.log('Goal message received:', goalMessage);
    
    try {
        const sender = await GoalBuddy.findOne({ name: goalMessage.user });
        //added
        const receiver = await GoalBuddy.findOne({name: goalMessage.receiverSocketId});
        if (!sender) {
            console.log('Sender not found');
            return;
        }

        // Check if receiver information exists and is valid
        //let receiver = null;
        // if (goalMessage.receiverSocketId) {
        //     receiver = await GoalBuddy.findOne({ name: goalMessage.receiverSocketId });
        // }

        if (!receiver) {
            console.log('Receiver not found or not connected');
        }

        // Create a new goal entry or append to an existing goal
        const newGoal = new Goal({
            senderId: sender._id,
            receiverId:  receiver._id ,
            goal: goalMessage.goal.name,
            description: goalMessage.goal.description, // Save the message textz
            startDate: goalMessage.goal.startDate, // Populate required fields
            endDate: goalMessage.goal.endDate,
            scheduleTime: goalMessage.goal.scheduleTime,
            sentTimestamp: goalMessage.timestamp,
            image: goalMessage.goal.image,
            goalType: goalMessage.goal.goalType,
        });

        await newGoal.save();
        console.log('Goal message saved to database');

        // Forward the goal message to the receiver if they're connected
        // if (receiver) {
            const receiverSocketId = users[goalMessage.receiverSocketId];
            if (receiverSocketId) {
                io.to(receiverSocketId).emit('goalMessage', {
                    user: sender.name,
                    goal: goalMessage.goal,
                    description: goalMessage.goal.description,
                    image: goalMessage.goal.image,
                    goalType: goalMessage.goal.goalType,
                    timestamp: goalMessage.timestamp,
                    scheduleTime: goalMessage.goal.scheduleTime,
                });
                console.log('Goal message sent to receiver:', receiver.name);
            } else {
                console.log('Recipient is not connected');
            }
        //}

        // Always send the message back to the sender as well
        socket.emit('goalMessage', {
            user: sender.name,
            goal: goalMessage.goal,
            description: goalMessage.goal.description,
            image: goalMessage.goal.image,
            timestamp: goalMessage.timestamp,
            goalType: goalMessage.goal.goalType,
            scheduleTime: goalMessage.goal.scheduleTime,
        });

    } catch (err) {
        console.error('Error handling goalMessage:', err);
    }
  });

  // Handle user messages
  socket.on('user-message', async (message) => {
    console.log('New message: ', message);
  
    try {
      // Find sender and receiver by name
      const sender = await GoalBuddy.findOne({ name: message.user });
      const receiver = await GoalBuddy.findOne({ name: message.receiverSocketId });

      if (!sender || !receiver) {
        console.log('Sender or receiver not found');
        return;
      }

      // Save message to the database
      const newMessage = new Message({
        senderId: sender._id,
        receiverId: receiver._id,
        text: message.text,
      });

      await newMessage.save();
      console.log('Message saved to database');

      // Forward the message to the receiver
      const receiverSocketId = users[message.receiverSocketId];
      if (receiverSocketId) {
        io.to(receiverSocketId).emit('message', message);
      } else {
        console.log('Recipient not connected');
      }

      // Always send the message back to the sender as well
      socket.emit('message', message);
    } catch (err) {
      console.error('Error handling message:', err);
    }
  });

  //goal winner
  socket.on('markComplete', async (data) => {
    const {goalId, winnerId} = data;
    console.log("Received goalId:", goalId);

    try {
      const goal = await Goal.findById(goalId);

      if(!goal){
        console.log('Gaol not found for ID:', goalId);
        return;
      }

      if(!goal.winner){
        goal.winner = winnerId;
        await goal.save();
        console.log(`User ${winnerId} marked as winner for goal ${goalId}`);

        io.emit('goalUpdate', {
          goalId: goal._id,
          winner: winnerId,
          status: goal.status,
      });
      }else{
        goal.status = 'completed';
        await goal.save();

        console.log(`Goal ${goalId} marked as completed`);

        // Notify all clients about the status update
        io.emit('goalUpdate', {
            goalId: goal._id,
            winner: userId,
            status: goal.status,
        });
      }
    } catch (error) {
      console.error('Error updating goal:', err);
    }
  })
  
  // Handle disconnect
  socket.on('disconnect', () => {
    console.log('A user has disconnected: ' + socket.id);
    // Remove the user from the users object
    for (const user in users) {
      if (users[user] === socket.id) {
        delete users[user];
        break;
      }
    }
  });
});

  
app.use(express.static('../Frontend/src/Components/Chat.jsx'));


app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    
    // Find the user by email
    const user = await GoalBuddy.findOne({ email });
    
    if (!user) {
        return res.status(400).json('No record exists :(');
    }

    // Compare the password with the hashed password in the database
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return res.status(400).json('The password is incorrect!');
    }

    // Generate tokens
    const accessToken = generateAccessToken({ id: user._id });
    const refreshToken = generateRefreshToken({ id: user._id });

    // Save the refresh token in the user document
    user.refreshToken = refreshToken;
    await user.save();

    // Return the tokens along with user details (id, name, email)
    res.json({
        accessToken,
        refreshToken,
        user: {
            _id: user._id,
            name: user.name,
            email: user.email
        }
    });
});


app.post('/token', async (req, res) => {
    const { token } = req.body;
    if (!token) return res.sendStatus(401);

    const user = await GoalBuddy.findOne({ refreshToken: token });
    if (!user) return res.sendStatus(403);

    jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, (err, userData) => {
        if (err) return res.sendStatus(403);
        const newAccessToken = generateAccessToken({ email: userData.email });
        res.json({ accessToken: newAccessToken });
    });
});

app.post('/signup', async (req, res) => {
    const existingUser = await GoalBuddy.findOne({ email: req.body.email });
    if (existingUser) {
        return res.status(400).json({ message: 'Email already exists' });
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const user = { ...req.body, password: hashedPassword };

    try {
        const newUser = await GoalBuddy.create(user);
        res.json(newUser);
    } catch (err) {
        res.status(500).json({ message: 'Server Error', error: err });
    }
});

app.get('/user/:email', async (req, res) => {
    try {
        const email = req.params.email;
        const user = await GoalBuddy.findOne({ email });
        if (user) {
            res.json({ name: user.name, email: user.email });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (err) {
        res.status(500).json({ message: 'Server Error' });
    }
});

app.get('/user/email/:email', async (req, res) => {
    try {
      const email = req.params.email;
      
      // Find user by email and return only the _id
      const user = await GoalBuddy.findOne({ email: email }).select('_id');
      
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      // Send back the user's _id
      res.json({ id: user._id });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Error fetching user data' });
    }
});

app.get('/users', async (req, res) => {
    try {
        const users = await GoalBuddy.find();
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: 'Server Error', error: err });
    }
});

//fetch chat history between two users
app.get('/chat/history/:senderEmail/:receiverEmail', async (req, res) => {
  try {
    const { senderEmail, receiverEmail } = req.params;
    const { page = 1, limit = 20 } = req.query; // Default to page 1, 20 messages per page

    const sender = await GoalBuddy.findOne({ email: senderEmail });
    const receiver = await GoalBuddy.findOne({ email: receiverEmail });

    if (!sender || !receiver) {
      return res.status(404).json({ message: 'Sender or receiver not found' });
    }

    const messages = await Message.find({
      $or: [
        { senderId: sender._id, receiverId: receiver._id },
        { senderId: receiver._id, receiverId: sender._id },
      ],
    })
      .sort({ createdAt: 1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit, 10));

    res.json(messages);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching chat history' });
  }
});


//Fetch all messages for a user
app.get('/chat/messages/:email', async(res, req) => {
  try {
    const {email} = req.params;
    const user = await GoalBuddy.findOne({email});

    if(!user){
      return res.status(404).json({message: 'User not found'});
    }

    const messages = await Message.find({
      $or: [
        { senderId: user._id },
        { receiverId: user._id },
      ],
    }).sort({createdAt: -1})//descending
    res.json(messages);
  } catch (err) {
    console.error(err);
    res.status(500).json({message: 'Error fetching user messages'});
  }
});

// //Fetch shared goals
// app.get('/goals/shared/:userId', async (req, res) => {
//   try {
//     const sharedGoals = await Goal.find({
//       $or:[
//         {senderId: req.params.userId},
//         {receiverId: req.params.userId}
//       ],
//       receiverId: {$ne: null}
//     }).populate('senderId receiverId', 'name email');
//     res.status(200).json(sharedGoals);
//   } catch (error) {
//     res.status(500).json({error: 'Failed to fetch shared goals'});
//   }
// });

// Fetch shared goals between specific sender and receiver
app.get('/goals/shared/:senderEmail/:receiverEmail', async (req, res) => {
  try {
    const { senderEmail, receiverEmail } = req.params;

    const sender = await GoalBuddy.findOne({ email: senderEmail });
    const receiver = await GoalBuddy.findOne({ email: receiverEmail });

    if (!sender || !receiver) {
      return res.status(404).json({ message: 'Sender or receiver not found' });
    }

    // Fetch shared goals
    const sharedGoals = await Goal.find({
      $or: [
        { senderId: sender._id, receiverId: receiver._id, goalType: "shared" },
        { senderId: receiver._id, receiverId: sender._id, goalType: "shared" },
      ],
    })
      .populate('senderId', 'name email')
      .populate('receiverId', 'name email')
      .select('goal description startDate endDate scheduleTime image senderId receiverId status')
      .sort({ createdAt: 1 });

    const currentTime = new Date(); // Get the current server time in UTC

    console.log("Server current time:", currentTime);

    // Update goal status based on time
    const updatedGoals = await Promise.all(
      sharedGoals.map(async (goal) => {
        const endDate = goal.endDate ? new Date(goal.endDate) : null;
        const scheduleTime = goal.scheduleTime;

        if (!endDate || isNaN(endDate)) {
          console.warn(`Invalid date format for goal ID: ${goal._id}`);
          return goal;
        }

        // Convert scheduleTime (HH:mm) into full date-time
        if (scheduleTime) {
          const [hours, minutes] = scheduleTime.split(":").map(Number);
          endDate.setHours(hours, minutes, 0);
        }

        console.log(`Checking Goal: ${goal.goal} | EndTime: ${endDate} | CurrentTime: ${currentTime}`);

        // Mark goal as incomplete if past due
        if (currentTime > endDate && goal.status === "pending") {
          goal.status = "incomplete";
          await goal.save();
        }

        return goal;
      })
    );

    res.status(200).json(updatedGoals);
  } catch (error) {
    console.error('Error fetching shared goals:', error);
    res.status(500).json({ error: 'Failed to fetch shared goals' });
  }
});


// API to save a personal goal
app.post('/api/goals', async(req, res) => {
  const {senderId, goalType, goal, description, startDate, endDate, image, scheduleTime, sentTimestamp} = req.body;
  if (!senderId || !goalType || !goal || !description || !startDate || !endDate || !scheduleTime) {
    return res.status(400).json({ message: "Missing required fields" });
  }
  try {
    const newGoal = new Goal({
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
    await newGoal.save();

    // res.status(201).json({
    //   message: "goal saved successfully",
    //   goal:savedGoal,
    // });
    console.log("backend me chal gya bhaii");
    
  } catch (error) {
    console.error('Error saving goal:', error);
    res.status(500).json({message: "failed to save goal"});
  }
})




//fetch goal id
app.get('/get-goal-id', async (req, res) => {
  const {senderId, receiverId, scheduleTime, startDate, endDate} = req.query;
  try {
    const filter = {};
    if (senderId) {
      filter.senderId = senderId;
    }

    if (receiverId) {
      filter.receiverId = receiverId;
    }

    if (scheduleTime) {
      filter.scheduleTime = scheduleTime; // Match if sentTimestamp is greater than or equal to the provided timestamp
    }

    if(startDate){
      filter.startDate = startDate;
    }

    if(endDate){
      filter.endDate = endDate;
    }

    // if (startDate && endDate) {
    //   console.log('Received startDate:', startDate);
    //   console.log('Received endDate:', endDate);

    //   const parsedStartDate = new Date(startDate);
    //   const parsedEndDate = new Date(endDate);

    //   console.log('Parsed startDate:', parsedStartDate);
    //   console.log('Parsed endDate:', parsedEndDate);

    //   if (isNaN(parsedStartDate.getTime()) || isNaN(parsedEndDate.getTime())) {
    //     return res.status(400).json({ message: 'Invalid startDate or endDate format' });
    //   }

    //   filter.startDate = { $gte: parsedStartDate, $lte: parsedEndDate }; // Match if goal's startDate is within the provided range
    // }

    const goal = await Goal.find(filter).select('_id');

    if (goal.length > 0) {
      res.json(goal); // Return the found goals
    } else {
      res.status(404).json({ message: 'No goals found matching the criteria' }); // No goals found
    }
  } catch (err) {
    console.error('Error fetching goals:', err);
    res.status(500).json({ message: 'Server Error', error: err });
  }
});


// // Endpoint to mark a goal as complete
// app.put('/goals/:goalId/mark-complete', async (req, res) => {
//   const { goalId } = req.params;  // Extract goalId from URL params
//   const { winnerId } = req.body;  // Extract winnerId from request body

//   try {
//     // Find the goal by ID and update its status to "complete"
//     const goal = await Goal.findById(goalId);

//     if (!goal) {
//       return res.status(404).json({ message: 'Goal not found' });  // Goal not found
//     }

//     // Check if the winner is already set
//     if (goal.winner) {
//       return res.status(400).json({ message: 'Goal already completed by another user' });
//     }

//     // Mark the goal as complete and set the winner
//     goal.status = 'completed';  // Set goal status to completed
//     goal.winner = winnerId;  // Assign winner

//     // Save the updated goal
//     await goal.save();

//     // Respond with the updated goal
//     res.json({ message: 'Goal marked as complete', goal });
//   } catch (error) {
//     console.error('Error marking goal complete:', error);
//     res.status(500).json({ message: 'Server Error', error: error.message });
//   }
// });

// Endpoint to mark a goal as complete
app.put('/goals/:goalId/mark-complete', async (req, res) => {
  const { goalId } = req.params;
  const { winnerId } = req.body;

  try {
    // Use findOneAndUpdate to atomically update the goal
    const updatedGoal = await Goal.findByIdAndUpdate(
      { _id: goalId, winner: null }, // Update only if winner is null
      { $set: { winner: winnerId, status: 'completed' } }, // Set the winner and status
      { new: true } // Return the updated document
    );

    // If no document was updated, it means the winner was already set
    if (!updatedGoal) {
      console.log(`Goal ${goalId} already completed. Winner: ${Goal.winner}`);
      return res.status(400).json({ message: 'Goal already completed by another user' });
    }

    // Respond with the updated goal
    res.json({ message: 'Goal marked as complete', goal: updatedGoal });
  } catch (error) {
    console.error('Error marking goal complete:', error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});


// Fetch personal goals for the logged-in user
// app.get("/personal-goals/:userId", async (req, res) => {
  
//   try {
//     //console.log("Fetching goals for user:", req.params.userId);
//     const personalGoals = await Goal.find({
//       senderId: req.params.userId,
//       goalType: 'personal'
//     });
//     //console.log("Goals found:", personalGoals);
//     res.status(200).json(personalGoals);
//   } catch (error) {
//     res.status(500).json({error: 'Failed to fetch personal goals'});
//   }
// });

app.get("/personal-goals/:userId", async (req, res) => {
  try {
    const personalGoals = await Goal.find({
      senderId: req.params.userId,
      goalType: "personal",
    });

    const currentTime = new Date(); // Server current time (UTC)
    console.log("Server current time:", currentTime);

    const updatedGoals = await Promise.all(
      personalGoals.map(async (goal) => {
        const endDate = goal.endDate ? new Date(goal.endDate) : null;
        const scheduleTime = goal.scheduleTime;

        if (!endDate || isNaN(endDate)) {
          console.warn(`Invalid date format for goal ID: ${goal._id}`);
          return goal;
        }

        // Convert scheduleTime (HH:mm) into full date-time
        if (scheduleTime) {
          const [hours, minutes] = scheduleTime.split(":").map(Number);
          endDate.setHours(hours, minutes, 0); // Set exact time
        }

        console.log(`Checking Goal: ${goal.goal} | EndTime: ${endDate} | CurrentTime: ${currentTime}`);

        // If the current time is past the goal's exact end time, mark it as incomplete
        if (currentTime > endDate && goal.status === "pending") {
          goal.status = "incomplete";
          await goal.save();
        }

        return goal;
      })
    );

    res.status(200).json(updatedGoals);
  } catch (error) {
    console.error("Error fetching personal goals:", error);
    res.status(500).json({ error: "Failed to fetch personal goals" });
  }
});


// Mark a goal as completed (Only if the goal is still within the deadline)
app.put("/mark-goal-complete/:goalId", async (req, res) => {
  try {
    const { goalId } = req.params;
    const completionTime = new Date().toString() ;
    const updatedGoal = await Goal.findByIdAndUpdate(
      goalId,
      { status: "completed", completionTimestamp: completionTime },
      { new: true }
    );

    if (!updatedGoal) {
      return res.status(404).json({ error: "Goal not found" });
    }

    res.status(200).json(updatedGoal);
  } catch (error) {
    console.error("Error marking goal as completed:", error);
    res.status(500).json({ error: "Failed to update goal" });
  }
});




server.listen(3006, () => {
    console.log("Server is Running!!....");
});