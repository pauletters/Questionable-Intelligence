import { Router } from 'express';
import authRoutes from './auth-routes.js';
import apiRoutes from './api/index.js';
import { authenticateToken } from '../middleware/auth.js';
import questionsRoutes from './questions-routes.js';  // Import the new questions routes

const router = Router();

router.use('/api/auth', authRoutes);  // Handles authentication routes
router.use('/api/questions', questionsRoutes);  // Add questions route
router.use('/api', authenticateToken, apiRoutes);  // Ensure that authenticated API routes are handled

export default router;