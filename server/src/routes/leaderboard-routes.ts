import { Router } from 'express';
import { getLeaderboardData } from '../controllers/leaderboard-controller.js';

const router = Router();

// Define the leaderboard endpoint
router.get('/', getLeaderboardData);  // Accessed as /api/leaderboard

export default router;
