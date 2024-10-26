// src/routes/hallOfShame-routes.ts

import { Router } from 'express';
import { getHallOfShame } from '../controllers/hall-of-shame-controller.js';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();

// Define a GET route for fetching the Hall of Shame data
router.get('/', authenticateToken, getHallOfShame);

export default router;
