import { Router } from 'express';
import authRoutes from './auth-routes.js';
import apiRoutes from './api/index.js';
import { authenticateToken } from '../middleware/auth.js';
import questionsRoutes from './questions-routes.js';
import correctAnswerRoutes from './correct-routes.js';
import submitAnswerRoutes from './submit.js';
import quizSessionRoutes from './quizSession-routes.js';
import leaderboardRoutes from './leaderboard-routes.js';  // Import leaderboard routes
import userRoutes from './user-stat-routes.js';

const router = Router();

// Public routes
router.use('/api/auth', authRoutes);  // Handles authentication routes

// Routes related to quiz and questions (Require authentication)
router.use('/api/questions', authenticateToken, questionsRoutes);
router.use('/api/submitAnswer', authenticateToken, submitAnswerRoutes);

// Routes for correct answers (Require authentication)
router.use('/api/answers', authenticateToken, correctAnswerRoutes);

// Quiz session routes (Require authentication)
router.use('/api/quizSessions', authenticateToken, quizSessionRoutes);

// Leaderboard route (Require authentication)
router.use('/api/leaderboard', authenticateToken, leaderboardRoutes);

router.use(userRoutes); // Ensure user routes are included

// General API routes (Require authentication)
router.use('/api', authenticateToken, apiRoutes);


export default router;
