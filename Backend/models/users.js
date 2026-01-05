const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
    name: String,
    email: { 
        type: String, 
        unique: true 
    }, 
    password: String,
    //friends: [{type: mongoose.Schema.Types.ObjectId, ref: 'GoalBuddy'}],
    refreshToken:{
        type:String,
        default:null
    },
    profilePic:{
        type: String,
        default: "https://i.pinimg.com/736x/d3/d5/2b/d3d52b6a9125a9e0f422981ad5672a99.jpg"
    },
});

const GoalBuddy = mongoose.model('GoalBuddy', UserSchema); 
module.exports = GoalBuddy;
