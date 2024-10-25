import { Router } from 'express';
import { getUserStats } from '../controllers/user-stats-controller.js';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();

// Route to get user statistics
router.get('/api/user/stats', authenticateToken, getUserStats);

export default router;