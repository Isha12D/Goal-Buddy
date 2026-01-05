const mongoose = require('mongoose');

const GoalSchema = new mongoose.Schema({
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'GoalBuddy',
        required: true,
    },
    receiverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'GoalBuddy', 
        default: null,
    },
    goalType:{
        type: String,
        enum: ['personal', 'friends'],
        required: true,
    },
    goal:{
        type: String,
        required: true
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
    image:{
        type: String,
    },
    scheduleTime:{
        type: String, 
        required: true,
    },
    status: {
        type: String,
        enum: ['pending', 'completed', 'failed','incomplete'],//added failed for analytics
        default: 'pending', 
    },
    winner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'GoalBuddy', 
        default: null, 
    },
    sentTimestamp:{
        type: Date,
        //required: true,
    },
    completionTimestamp: {
        type: Date,  // Store the timestamp of completion
        default: null,
    }
},
);

const Goal = mongoose.model('Goal', GoalSchema);
module.exports = Goal;