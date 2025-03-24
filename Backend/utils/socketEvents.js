// socketEvents.js

export const sendGoalMessage = (socket, currentUser, selectedUser, goalData) => {
    // Ensure `selectedUser.socketId` contains the actual socket ID of the receiver
    if (!selectedUser.socketId) {
        console.error("Selected user socket ID is missing");
        return;
    }

    const goalMessage = {
        user: currentUser.name,
        receiverSocketId: selectedUser.socketId, // Use the socket ID, not the name
        goal: goalData,
        timestamp: new Date().toISOString(),
    };

    // Emit the message to the server
    socket.emit("send-goal-message", goalMessage);
};

  