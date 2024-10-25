import { Router } from 'express';
import authRoutes from './auth-routes.js';
import apiRoutes from './api/index.js';
import { authenticateToken } from '../middleware/auth.js';
import questionsRoutes from './questions-routes.js';
import correctAnswerRoutes from './correct-routes.js';
import submitAnswerRoutes from './submit.js';
import quizSessionRoutes from './quizSession-routes.js';

const router = Router();

// Public routes
router.use('/api/auth', authRoutes);  // Handles authentication routes

// Routes related to quiz and questions (Require authentication)
router.use('/api/questions', authenticateToken, questionsRoutes);  // Add questions route with token authentication
router.use('/api/submitAnswer', authenticateToken, submitAnswerRoutes);  // Answer submission route with token authentication

// Routes for correct answers (Require authentication)
router.use('/api/answers', authenticateToken, correctAnswerRoutes);  // Mount correctAnswer route with token authentication

// Quiz session routes (Require authentication)
router.use('/api/quizSessions', authenticateToken, quizSessionRoutes);  // Handle quiz session creation and management

// General API routes (Require authentication)
router.use('/api', authenticateToken, apiRoutes);  // Ensure that authenticated API routes are handled



export default router;