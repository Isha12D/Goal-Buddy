import React, { useEffect, useRef, useState } from "react";
import { FaPaperPlane, FaPaperclip } from "react-icons/fa";
import { useAuth } from "../Context/AuthContext";
import { useGoal } from "../Context/GoalContext";
//import { createGoalMessage } from '../utils/goalUtils';
import { io } from "socket.io-client";
import Goals from "./Goals";
import {toast, ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Button,
} from "@mui/material";
import { MdVideocam } from "react-icons/md";
import VideoCall from "./VideoCall";

const Chat = ({ selectedUser , onBack}) => {
  const { currentUser } = useAuth();
  const { goalData, timestamp, setGoalData, setTimestamp } = useGoal();
  const [isGoalComplete, setIsGoalComplete] = useState(false);
  const [completedGoals, setCompletedGoals] = useState(new Set()); // Track completed goal IDs
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const socket = useRef(null);
  //video call
  const [showVideoCall, setShowVideoCall] = useState(false);

  const handleVideoCallClick = () => {
    setShowVideoCall(true);
  };

  const getGoalId = async (scheduleTime ) => {
    try {
      console.log("The current user id is: ", currentUser?._id);
      console.log("The selected user id is: ", selectedUser?._id);
      console.log("The start date is:", goalData.startDate);
      console.log("The end date is:", goalData.endDate);
      console.log("the scheduled time is :", goalData.scheduleTime);

      const response = await fetch(
        `http://localhost:3006/goals/get-goal-id?currentUserId=${currentUser._id}&selectedUserId=${selectedUser._id}&scheduleTime=${scheduleTime}`
      );
      const data = await response.json();

      if (response.ok && data.length > 0) {
        // Access the first goal's _id
        return data[0]?._id;
      } else {
        console.log("No goals found matching the criteria");
        return null;
      }
    } catch (error) {
      console.error("Error fetching goal ID:", error);
      return null;
    }
  };

  useEffect(() => {
    // Establish socket connection once
    if (!socket.current) {
      socket.current = io("http://localhost:3006");

      // Listen for incoming messages
      socket.current.on("message", (message) => {
        // Only add the message if it's for the current selected user
        if (
          (message.receiverSocketId === currentUser.name &&
            message.user === selectedUser?.name) ||
          (message.user === currentUser.name &&
            message.receiverSocketId === selectedUser?.name)
        ) {
          setMessages((prevMessages) =>
            // prevMessages.some((msg) => msg._id === message._id)
            // ? prevMessages :
            [...prevMessages, message]
          );
        }
        // console.log("message.receiverSocketId: ",message.receiverSocketId);
        // console.log("currentUser.name:", currentUser.name);
        // console.log("message.user:", message.user);
        // console.log("selectedUser?.name", selectedUser?.name);
      });

      //listen for goal messages
      // socket.current.on('goalMessage', (goalMessage) => {
      //   if ((goalMessage.receiverSocketId === currentUser.name && goalMessage.user === selectedUser?.name) ||
      //       (goalMessage.user === currentUser.name && goalMessage.receiverSocketId === selectedUser?.name)) {
      //     setMessages((prevMessages) => [
      //       ...prevMessages,
      //       {
      //         ...goalMessage,
      //         displayTime: new Date(goalMessage.timestamp).toLocaleTimeString([], {
      //           hour: '2-digit',
      //           minute: '2-digit',
      //         }),
      //       },
      //     ]);
      //   }
      //   console.log("goalMessage.receiverSocketId: ",goalMessage.receiverSocketId);
      //   console.log("currentUser.name:", currentUser.name);
      //   console.log("goalMessage.user:", goalMessage.user);
      //   console.log("selectedUser?.name", selectedUser?.name);
      // });

      //listen for goal messages

      socket.current.on("goalMessage", (goalMessage) => {
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            ...goalMessage,
            displayTime: new Date(goalMessage.timestamp).toLocaleTimeString(
              [],
              {
                hour: "2-digit",
                minute: "2-digit",
              }
            ),
            //can or can't
            goal: {
              ...goalMessage.goal,
              scheduledTime: goalMessage.goal.scheduledTime || "Not Scheduled", // Fallback
            },
          },
        ]);

        getGoalId(goalMessage.goal.scheduleTime);
      });

      // Register the user on the server
      socket.current.emit("register", currentUser.name);
    }

    console.log(
      `I am in Chat.jsx: currentUser: ${JSON.stringify(currentUser?.name)}`
    );
    console.log(
      `I am in Chat.jsx: selectedUser: ${JSON.stringify(selectedUser?.name)}`
    );
    // Clear messages when the selectedUser changes
    setMessages([]);

    return () => {
      if (socket.current) {
        socket.current.disconnect();
        socket.current = null;
      }
    };
  }, [currentUser, selectedUser]);

  useEffect(() => {
    if (selectedUser) {
      const fetchChatHistory = async () => {
        try {
          const response = await fetch(
            `http://localhost:3006/chat/history/${currentUser.email}/${selectedUser.email}?page=1&limit=30`
          );
          const data = await response.json();
          const formattedMessages = data.map((msg) => ({
            ...msg,
            user:
              msg.senderId === currentUser._id
                ? currentUser.name
                : selectedUser.name,
            timestamp: msg.timestamp,
          }));
          setMessages((prevMessages) => [
            ...formattedMessages,
            ...prevMessages,
          ]);
        } catch (error) {
          console.error("Error fetching chat history:", error);
        }
      };

      fetchChatHistory();
    }
  }, [currentUser, selectedUser]);

  useEffect(() => {
    if (selectedUser) {
      const fetchGoalHistory = async () => {
        try {
          const response = await fetch(
            `http://localhost:3006/goals/shared/${currentUser.email}/${selectedUser.email}?page=1&limit=30`
          );
          const data = await response.json();

          const formattedMessages = data.map((message) => {
            const user =
              message.senderId === currentUser._id
                ? currentUser.name
                : selectedUser.name;

            // ✅ Console log user1
            console.log("User1 Name:", user);

            return {
              ...message,
              user,
              status: message.status,
              winner: message.winner,
              timestamp: message.sentTimestamp,

              goal: {
                name: message.name,
                startDate: message.startDate,
                endDate: message.endDate,
                scheduleTime: message.scheduleTime,
                goal: message.name,
                image: message.image,
                sentTimestamp: message.timestamp,
              },
            };
          });

          setMessages((prevMessages) => [
            ...formattedMessages,
            ...prevMessages,
          ]);
        } catch (error) {
          console.error("Error fetching goal history:", error);
        }
      };

      fetchGoalHistory();
    }
  }, [currentUser, selectedUser]);

  const sendMessage = () => {
    if (newMessage.trim() && selectedUser) {
      const timestamp = new Date().toISOString();
      const message = {
        user: currentUser.name,
        text: newMessage,
        timestamp: timestamp,
        receiverSocketId: selectedUser.name, // Target specific user
      };
      console.log(currentUser._id);
      console.log(selectedUser._id);

      // Emit message to the server
      socket.current.emit("user-message", message);

      // Append message locally
      //setMessages((prevMessages) => [...prevMessages, message]);
      setNewMessage("");
    } else {
      console.log("No recipient selected or empty message");
    }
  };

  // Function to mark the goal as complete
  const markComplete = async (goalId) => {
    try {
      // Call the API to mark the goal as complete
      console.log("Ima in mark complete with goal id:", goalId);

      const response = await fetch(
        `http://localhost:3006/goals/${goalId}/mark-complete`,
        {
          method: "PUT",
          body: JSON.stringify({ winnerId: currentUser._id }),
          headers: { "Content-Type": "application/json" },
        }
      );

      // Parse the response as JSON
      const data = await response.json();

      // Log the response data if successful
      if (response.ok) {
        console.log("Goal marked complete:", data);

        toast.success("🎉 Goal completed successfully!", {
          position: "top-right",
          autoClose: 3000,
        });

        setCompletedGoals((prev) => new Set([...prev, goalId]));
        socket.current.emit("goal-completed", {
          goalId,
          winnerId: currentUser._id,
          particpants: [currentUser.name, selectedUser.name],
        });
      } else {
        console.log("Failed to mark goal complete:", data.message);
        toast.error(` You lost! ${selectedUser.name} has already completed this goal.`, {
        position: "top-right",
        autoClose: 3000,
      });
      }
    } catch (error) {
      console.error("Error marking goal complete:", error);
      toast.error("⚠️ Something went wrong. Try again later.", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  const handleGoalCheckboxChange = async (e, scheduleTime) => {
    const isChecked = e.target.checked;
    setIsGoalComplete(isChecked);
    //console.log('goal id is:', goalId);
    if (isChecked) {
      const goalId = await getGoalId(scheduleTime); // Get the goalId from the goalMessage
      console.log("Ima in Chat.jsx and here is the goal id:", goalId);
      if (goalId) {
        // Proceed to mark complete if no winner
        console.log("✅ Marking goal complete, goalId:", goalId);
        markComplete(goalId);
      }
    }
  };

  //goals component passing
  const openDialog = () => {
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
  };

  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (!selectedUser) {
    return (
      <div className="w-full relative h-screen flex items-center justify-center bg-gray-950">
        <h1 className="text-3xl justify-center items-center p-4">
          Set your goal for today with your friends.!!
        </h1>
      </div>
    );
  }

  return (
    <div className="w-full relative h-screen flex flex-col justify-between bg-gray-950 ">
      
      <div className="flex items-center justify-between p-4 bg-gray-900">
        <div className="sm:hidden p-2 bg-gray-900 flex items-center">
        <button
          onClick={onBack}
          className="text-white flex items-center space-x-2"
        >
          ← <span>Back</span>
        </button>
      </div>
        <h1 className="text-xl font-bold text-white">{selectedUser.name}</h1>
        <MdVideocam
          className="text-white text-2xl cursor-pointer hover:text-green-500"
          onClick={handleVideoCallClick}
        />
      </div>

      {/* video call */}
      {showVideoCall && (
        <VideoCall
          socket={socket}
          currentUser={currentUser}
          remoteUser={selectedUser}
          onClose={() => setShowVideoCall(false)}
          isCaller={true}
        />
      )}

      {/* Chat Messages */}
      <div className="chat-box flex-1 p-4 overflow-y-auto space-y-4">
        {messages
          .filter((msg) => !msg.goal) // Exclude goal messages
          .map((msg, index) => (
            <div
              key={index}
              className={`chat ${
                msg.user === currentUser.name ? "chat-end" : "chat-start"
              }`}
            >
              <div
                className={`chat-bubble ${
                  msg.user === currentUser.name
                    ? "bg-orange-200 text-right text-black"
                    : "bg-slate-600 text-left text-white"
                }`}
              >
                <div>
                  <span className="font-bold text-sm text-slate-300">
                    {msg.user === currentUser.name ? "You" : selectedUser.name}
                  </span>
                </div>
                <div className="flex justify-between items-end">
                  <span className="text-gray-800">{msg.text}</span>
                  <span className="text-xs text-gray-500 ml-2">
                    {new Date(msg.timestamp).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              </div>
            </div>
          ))}
        <div ref={messagesEndRef}></div>

        {/* Goal Messages */}
        <div className="goal-messages p-4">
          {messages
            .filter((message) => message.goal) // Render only goal messages
            .map((message, index) => (
              <div
                key={index}
                className={`goal-card p-4 mb-2 rounded-lg ${
                  message.user === currentUser.name
                    ? "bg-orange-200 text-right"
                    : "bg-gray-800 text-left"
                }`}
              >
                {/* Sender Heading (e.g., "You have invited ...") */}
                {message.user === currentUser.name ? (
                  <h4 className="text-lg font-bold text-orange-400">
                    You have invited {selectedUser.name} to join{" "}
                    {message.goal.name}
                  </h4>
                ) : (
                  <h4 className="text-lg font-bold text-blue-400">
                    {message.user} has invited you to join {message.goal.name}
                  </h4>
                )}

                {/* Goal Image */}
                <img
                  src={message.goal.image}
                  alt={message.goal.name}
                  className="w-full h-32 object-cover rounded-lg mt-2"
                />

                {/* Goal Start and End Dates */}
                <p className="text-sm  mt-1">
                  Start Date: {message.goal.startDate}
                </p>
                <p className="text-sm ">End Date: {message.goal.endDate}</p>

                {/* Time Field (display when the goal was sent) */}
                <p>
                  Sent: {new Date(message.goal.timestamp).toLocaleTimeString()}
                  {" | "}
                  Scheduled: {message.goal.scheduleTime}
                </p>

                {/* Winner's Checkbox */}
                {/* Show completion status or checkbox */}

                {message.status === "completed" ? (
                  <div className="text-sm text-green-500">
                    ✅ Completed by {message.winner?.name || "Unknown"}
                  </div>
                ) : message.status === "incomplete" ? (
                  <div className="text-sm text-red-500">
                    ❌ Incomplete (end date passed)
                  </div>
                ) : (
                  <div className="inline-flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={`goal-complete-${index}`}
                      className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      checked={isGoalComplete}
                      onChange={(e) =>
                        handleGoalCheckboxChange(e, message.goal.scheduleTime)
                      }
                    />
                    <label
                      htmlFor={`goal-complete-${index}`}
                      className="text-sm text-gray-400"
                    >
                      Mark goal as complete
                    </label>
                  </div>
                )}
              </div>
            ))}
        </div>
      </div>

      {/* Input and Buttons */}
      <div className="flex items-center p-4 border-t border-gray-700">
        <div className="flex items-center space-x-4">
          {/* Trophy Button with Tooltip */}
          <div className="relative group">
            <button
              onClick={openDialog}
              className="p-2 text-gray-600 hover:text-gray-300 flex items-center justify-center"
            >
              <img
                src="https://i.pinimg.com/736x/b0/93/5e/b0935e12f8b1519bf562ba9967b9aa1c.jpg"
                alt="Trophy"
                className="rounded-full w-12 h-12"
              />
            </button>
            {/* Tooltip */}
            <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-max bg-black text-white text-xs font-medium px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
              Set goals with your friends
            </span>
          </div>

          {/* Message Input */}
          <input
            type="text"
            className="flex-grow p-2 border border-gray-700 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Type your message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
          />
          <button
            className="p-2 bg-orange-500 text-white rounded-r-lg hover:bg-blue-600"
            onClick={sendMessage}
          >
            <FaPaperPlane size={20} />
          </button>
        </div>
      </div>

      {/* Dialog to display Goals component */}
      {isDialogOpen && (
        <Dialog
          open={isDialogOpen}
          onClose={closeDialog}
          fullWidth
          maxWidth="md"
        >
          <DialogTitle>Set your Goal</DialogTitle>
          <DialogContent>
            <Goals
              socket={socket.current}
              currentUser={currentUser}
              selectedUser={selectedUser}
              goalType={"friends"}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={closeDialog} color="primary">
              Close
            </Button>
          </DialogActions>
        </Dialog>
      )}
      <ToastContainer />

    </div>
  );
};

export default Chat;
