import express from "express";
import { getTopCompletedGoals, getTopIncompleteGoals, topWinners, userRank, getCompletedGoalsCount } from "../controllers/analyticsController.js";

const router = express.Router();

router.get("/top-winners", topWinners);
router.get("/rank/:userId", userRank);
router.get("/top-completed-goals/:userId", getTopCompletedGoals);
router.get("/top-incomplete-goals/:userId", getTopIncompleteGoals);
router.get('/completed-goals/:userId', getCompletedGoalsCount);

export default router;
