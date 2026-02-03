import express from "express";

import {
  getAllUsers,
  getUserByEmail,
  updateProfile,
  deleteUser,
} from "../controllers/userController.js";

import { authenticateUser } from "../middleware/auth.js";
import upload from "../utility/multer.js";

const router = express.Router();

router.get("/", getAllUsers);

router.get("/:email", getUserByEmail);

router.put(
  "/update",
  authenticateUser,
  upload.single("profilePic"),
  updateProfile
);

router.delete("/delete/:id", authenticateUser, deleteUser);

export default router;
