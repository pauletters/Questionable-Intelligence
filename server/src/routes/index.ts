import { Router } from 'express';
import authRoutes from './auth-routes.js';
import apiRoutes from './api/index.js';
import { authenticateToken } from '../middleware/auth.js';
import questionsRoutes from './questions-routes.js';
import submitRoutes from './submit.js'; // Combined submit routes
import quizSessionRoutes from './quizSession-routes.js';
import leaderboardRoutes from './leaderboard-routes.js';
import userRoutes from './user-stat-routes.js';
import hallOfShameRoutes from './hall-of-shame-routes.js'; // Import Hall of Shame routes

const router = Router();

// Public routes
router.use('/api/auth', authRoutes);  // Handles authentication routes

// Routes related to quiz and questions (Require authentication)
router.use('/api/questions', authenticateToken, questionsRoutes);

// Routes for answer submission and retrieval (Require authentication)
router.use('/api/answers', authenticateToken, submitRoutes);

// Quiz session routes (Require authentication)
router.use('/api/quizSessions', authenticateToken, quizSessionRoutes);

// Leaderboard route (Require authentication)
router.use('/api/leaderboard', authenticateToken, leaderboardRoutes);

// User stats route (Require authentication)
router.use('/api/user', authenticateToken, userRoutes);

// Hall of Shame route (Require authentication)
router.use('/api/hallOfShame', authenticateToken, hallOfShameRoutes);

// General API routes (Require authentication)
router.use('/api', authenticateToken, apiRoutes);

export default router;
