import { Router } from 'express';
import { getUserStats } from '../controllers/user-stats-controller.js';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();

router.get('/stats', authenticateToken, getUserStats);

export default router;
