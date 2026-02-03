;import React, { useState } from "react"; 
import { useGoal } from "../Context/GoalContext";
import { Card, CardContent, Typography, Grid, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Button, InputAdornment } from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import axios from 'axios';

const goalsData = [
    { id: 1, name: "Master a Language", image: "https://i.pinimg.com/736x/c7/15/4b/c7154b20aa547387ea43913c4adcadc9.jpg" },
    { id: 2, name: "Algorithm", image: "https://i.pinimg.com/736x/3c/fb/3d/3cfb3d6154b75cc328c1fd6d1448803b.jpg" },
    { id: 3, name: "Framework/Development", image: "https://i.pinimg.com/736x/41/a7/11/41a711d6a1745b4071cb1930c6cdac9b.jpg" },
    { id: 4, name: "Mini Project/Group Project", image: "https://i.pinimg.com/736x/9f/66/bb/9f66bbd58e32cec9cda7f901a2d11d48.jpg" },
    { id: 5, name: "Hackathon Prep", image: "https://i.pinimg.com/736x/29/01/37/290137c8bd4dba1b211fc5dc42f9445c.jpg" },
    { id: 6, name: "Search Ideas", image: "https://i.pinimg.com/736x/1b/db/fa/1bdbfac2d0fc15e94a1e024ac0286af8.jpg" },
    { id: 7, name: "Daily Streak Coding", image: "https://i.pinimg.com/474x/8b/26/a3/8b26a3fcbe694fe8bcc85bb79e0564df.jpg" },
    { id: 8, name: "Contest Weekly", image: "https://i.pinimg.com/736x/06/50/c7/0650c750aecf30217665824fbf10547b.jpg" },
    { id: 9, name: "Mock Interview", image: "https://i.pinimg.com/736x/44/17/07/441707f8daefade21577cd9061b2d3c5.jpg" },
    { id: 10, name: "Portfolio", image: "https://i.pinimg.com/736x/b0/1c/de/b01cde2b5572f5018e299a96922c7007.jpg" },
    { id: 11, name: "Meet /Group Study", image: "https://i.pinimg.com/736x/f5/02/c5/f502c54ee4662d5ba648cf5e13f9d038.jpg" },
    { id: 12, name: "Communication", image: "https://i.pinimg.com/736x/d0/4d/89/d04d891d778f4613e8c0860ff46825f0.jpg" },
    { id: 13, name: "Tech Comics", image: "https://i.pinimg.com/736x/ac/8b/ba/ac8bba4ecb6473928bfd0b955e37343f.jpg" },
    { id: 14, name: "AI/ML", image: "https://i.pinimg.com/736x/db/7c/19/db7c190693e054346e047d9a4480a838.jpg" },
    { id: 15, name: "Blockchain", image: "https://i.pinimg.com/474x/a6/52/bd/a652bd3cfb5e4378d94d5fa17627dae1.jpg" },
    { id: 16, name: "Others", image: "https://i.pinimg.com/736x/0b/52/af/0b52af13046eb975361af23d83d460fd.jpg" }, // Add an image or use a placeholder
];
  
const darkTheme = createTheme({
  palette: {
    mode: "dark",
    background: {
      default: "#121212", // Dark background for the app
    },
    text: {
      primary: "#ffffff", // White text
    },
  },
});

const Goals = ({socket, currentUser, selectedUser, goalType}) => {
  const { setGoalData, setTimestamp } = useGoal();
  const [selectedGoal, setSelectedGoal] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const today = new Date().toISOString().split("T")[0]; //new Date()

// Creates a new Date object with the current date and time.

// .toISOString()

// Converts the date to a standard ISO 8601 string:
// "2025-07-24T14:32:00.000Z"

// .split("T")

// Splits the ISO string at the "T" character:

// js
// Copy
// Edit
// ["2025-07-24", "14:32:00.000Z"]
// [0]

// Gets the first part: "2025-07-24"
  const [goalData, setLocalGoalData] = useState({
    description: "",
    startDate: today,
    endDate: today,
    scheduleTime: today,
    sentTimestamp: new Date(),
  });

  const handleGoalClick = (goal) => {
    setSelectedGoal(goal);
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
    setSelectedGoal(null);
  };

  const handleFieldChange = (e) => {
    const { name, value } = e.target;
    setLocalGoalData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  

  //const scheduledTimeISO = new Date(${today}T${goalData.scheduleTime}:00Z).toISOString();

  const handleSubmit = () => {
    //console.log("Goal set:", goalData);
    setGoalData(goalData);
    const goalMessage = {
      user: currentUser.name,
      receiverSocketId: selectedUser.name,
      goal:{
        name: selectedGoal?.name,
        image: selectedGoal?.image,
        startDate: goalData.startDate,
        endDate: goalData.endDate,
        description: goalData.description,
        scheduleTime: goalData.scheduleTime,
        goalType: goalType,
        timestamp: new Date(),
      },
      
    };

    console.log(currentUser._id);
    console.log(selectedUser._id);
    //  console.log('receiverSocketId:', receiverSocketId);
    if(goalType === 'friends'){
      socket.emit('goalMessage', goalMessage);
    }
    else{
      savePersonalGoalToDB(goalMessage);
    }

    setLocalGoalData({
      description: "",
      startDate: "",
      endDate: "",
      //friend:"",
      scheduleTime: "",
    });
    handleDialogClose();
  };

  const savePersonalGoalToDB = async(goalMessage) => {
    try {
      const goalData = {
        senderId: currentUser?._id,
        goalType: 'personal',
        goal: goalMessage.goal.name,
        description: goalMessage.goal.description,
        startDate: goalMessage.goal.startDate,
        endDate: goalMessage.goal.endDate,
        image: goalMessage.goal.image || '',
        scheduleTime: goalMessage.goal.scheduleTime,
        sentTimestamp: goalMessage.timestamp,
      };

      const response = await axios.post('http://localhost:3006/goals', goalData, {
        headers: { 'Content-Type': 'application/json' },
      });
      if(response.status === 201){
        console.log('Personal goal saved successfully!');
      } else{
        console.error('Failed to save the personal goal.');
      }
    } catch (error) {
      console.error('Error saving personal goal to database:', error);
      
    }
  }

  return (
    <ThemeProvider theme={darkTheme}>
      <div style={{ padding: "20px" }}>
        <Typography variant="h6" align="center" color="black" style={{ marginBottom: "20px" }}>
          Set your Goal for Today!
        </Typography>

        <Grid container spacing={4}>
          {goalsData.map((goal) => (
            <Grid item xs={12} sm={6} md={3} key={goal.id}>
              <Card
                sx={{
                  backgroundColor: selectedGoal?.id === goal.id ? "black" : "#333",
                  color: "white",
                  border: selectedGoal?.id === goal.id ? "2px solid #ffd700" : "none",
                  cursor: "pointer",
                  '&:hover': {
                    transform: "scale(1.05)",
                    transition: "transform 0.3s",
                  },
                }}
                onClick={() => handleGoalClick(goal)}
              >
                <img src={goal.image} alt={goal.name} style={{ width: "100%", height: "200px", objectFit: "cover" }} />
                <CardContent>
                  <Typography variant="h6" align="center">
                    {goal.name}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Goal Setting Dialog Form*/}
        <Dialog open={openDialog} onClose={handleDialogClose}>
          <DialogTitle>Set Your Goal</DialogTitle>
          <DialogContent>
            <div style={{ textAlign: "center" }}>
              {selectedGoal && (
                <img src={selectedGoal.image} alt={selectedGoal.name} style={{ width: "100px", height: "100px", marginBottom: "10px" }} />
              )}
              <Typography variant="h6" style={{ marginBottom: "10px" }}>
                {selectedGoal?.name}
              </Typography>
              <TextField
                fullWidth
                label="Add Description"
                variant="outlined"
                name="description"
                value={goalData.description || ""}
                onChange={handleFieldChange}
                style={{ marginBottom: "10px" }}
              />
              {/* <TextField
                fullWidth
                label="Choose a Friend"
                variant="outlined"
                name="friend"
                value={goalData.friend}
                onChange={handleFieldChange}
                style={{ marginBottom: "10px" }}
              /> */}
              <TextField
                fullWidth
                label="Start Date"
                variant="outlined"
                type="date"
                name="startDate"
                value={goalData.startDate || today}
                onChange={handleFieldChange}
                style={{ marginBottom: "10px" }}
                InputLabelProps={{
                  shrink: true,
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <CalendarTodayIcon style={{ color: "black" }} />
                    </InputAdornment>
                  ),
                }}
                inputProps={{
                  min: today, // Restrict to today or future dates
                }}
              />
              <TextField
                fullWidth
                label="End Date"
                variant="outlined"
                type="date"
                name="endDate"
                value={goalData.endDate || today}
                onChange={handleFieldChange}
                style={{ marginBottom: "10px" }}
                InputLabelProps={{
                  shrink: true,
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <CalendarTodayIcon style={{ color: "black" }} />
                    </InputAdornment>
                  ),
                }}
                inputProps={{
                  min: goalData.startDate || today, // Restrict to start date or future dates
                }}
              />
              <TextField
                fullWidth
                label="Schedule Time"
                variant="outlined"
                type="time"
                name="scheduleTime"
                value={goalData.scheduleTime || ""}
                onChange={handleFieldChange}
                style={{ marginBottom: "10px" }}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </div>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDialogClose} color="secondary">
              Cancel
            </Button>
            <Button onClick={handleSubmit} style={{ backgroundColor: "#ffd700", color: "black" }}>
              Set Goal
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </ThemeProvider>
  );
};

export default Goals;