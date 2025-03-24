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
    }
});

const GoalBuddy = mongoose.model('GoalBuddy', UserSchema); 
module.exports = GoalBuddy;
