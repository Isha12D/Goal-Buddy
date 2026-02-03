import express from "express";
import { createGoal, getPersonalGoals, getSharedGoals, markComplete, markPersonalGoalComplete, getGoalId } from "../controllers/goalController.js";

const router = express.Router();

router.post("/", createGoal);
router.get("/personal/:userId", getPersonalGoals)
router.get("/shared/:senderEmail/:receiverEmail", getSharedGoals);
router.put("/:goalId/mark-complete", markComplete);
router.put("/mark-goal-complete/:goalId", markPersonalGoalComplete);
router.get("/get-goal-id", getGoalId);

export default router;
