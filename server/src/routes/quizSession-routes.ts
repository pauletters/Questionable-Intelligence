import { Router, Request, Response } from 'express';
import { QuizSession } from '../models/quizSession.js';  // Import the quiz session model

const router = Router();

// POST /api/quizSessions - Create a new quiz session
router.post('/', async (req: Request, res: Response) => {
  const { userId } = req.body;

  try {
    const quizSession = await QuizSession.create({
      userId,
      startTime: new Date(),
    });

    return res.status(201).json({ quizSessionId: quizSession.id });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Error creating quiz session:', error.message);
      return res.status(500).json({ message: 'Error creating quiz session', error: error.message });
    }
    return res.status(500).json({ message: 'Unknown server error' });
  }
});

export default router;