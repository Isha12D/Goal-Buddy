export const createGoalMessage = (currentUser, selectedUser, goalData, selectedGoal) => {
    return {
      user: currentUser.name,
      receiverSocketId: selectedUser.name,
      goal: {
        name: selectedGoal?.name,
        image: selectedGoal?.image,
        startDate: goalData.startDate,
        endDate: goalData.endDate,
        description: goalData.description,
        scheduleTime: goalData.scheduleTime,
      },
      timestamp: new Date().toISOString(),
    };
};
  