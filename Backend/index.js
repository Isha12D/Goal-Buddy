import express from "express";
import cors from "cors";
import http from "http";
import dotenv from "dotenv";
import { Server } from "socket.io";

import connectDB from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import goalRoutes from "./routes/goalRoutes.js";
import analyticsRoutes from "./routes/analyticsRoutes.js";

import socketHandler from "./socket/socketHandler.js";

dotenv.config();

const app = express();
const server = http.createServer(app);

app.use(express.json());
app.use(cors({
  origin: "http://localhost:5174",
  credentials: true,
}));

// DB
connectDB();

// Routes
app.use("/auth", authRoutes);
app.use("/user", userRoutes);
app.use("/chat", chatRoutes);
app.use("/goals", goalRoutes);
app.use("/analytics", analyticsRoutes);

// Socket
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5174",
    methods: ["GET", "POST"]
  }
});

socketHandler(io);

// Server
server.listen(3006, () => {
  console.log("Server running on 3006 🚀");
});
