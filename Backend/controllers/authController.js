import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import GoalBuddy from "../models/users.js";
import { generateAccessToken, generateRefreshToken } from "../middleware/auth.js";

export const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await GoalBuddy.findOne({ email });
  if (!user) return res.status(400).json("No record exists");

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json("Wrong password");

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  user.refreshToken = refreshToken;
  await user.save();

  res.json({
    accessToken,
    refreshToken,
    user
  });
};

export const signup = async (req, res) => {
  const exists = await GoalBuddy.findOne({ email: req.body.email });
  if (exists) return res.status(400).json({ message: "Email exists" });

  const hashed = await bcrypt.hash(req.body.password, 10);

  const newUser = await GoalBuddy.create({
    ...req.body,
    password: hashed
  });

  res.json(newUser);
};
