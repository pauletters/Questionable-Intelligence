import { Router, Request, Response } from 'express';
import { Answer } from '../models/answer.js';
import { Question } from '../models/question.js';

const router = Router();

// GET /api/answers/:quizSessionId - Fetch answers for a specific quiz session
router.get('/:quizSessionId', async (req: Request, res: Response) => {
  try {
    const answers = await Answer.findAll({
      where: { quizSessionId: req.params.quizSessionId },
      include: [
        {
          model: Question,
          as: 'question',
          attributes: ['text', 'correctAnswer'], // Retrieve 'text' for question text
        }
      ],
    });

    if (!answers || answers.length === 0) {
      return res.status(404).json({ message: 'No answers found for this quiz session' });
    }

    return res.status(200).json({ answers });
  } catch (error) {
    console.error('Error fetching answers:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});

export default router;
