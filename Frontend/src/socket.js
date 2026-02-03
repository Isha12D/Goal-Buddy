import { io } from "socket.io-client";

export const socket = io("http://localhost:3006"); // Match backend port
