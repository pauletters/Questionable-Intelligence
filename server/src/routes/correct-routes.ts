import { Router, Request, Response } from 'express';
import { Answer } from '../models/answer.js';  // Ensure the Answer model is imported
import { Question } from '../models/question.js';  // Ensure the Question model is imported

const router = Router();

// GET /api/answers/:quizSessionId - Fetch answers for a specific quiz session
router.get('/:quizSessionId', async (req: Request, res: Response) => {
  const { quizSessionId } = req.params;  // Extract quizSessionId from the route parameters

  try {
    // Fetch all answers for the given quiz session, including the related question data
    const answers = await Answer.findAll({
      where: { quizSessionId },
      include: [{model: Question, as: 'question'}],  // This will include the question data related to the answer
    });

    // If no answers found, return 404
    if (!answers || answers.length === 0) {
      return res.status(404).json({ message: 'No answers found for this quiz session' });
    }

    // Return the answers if found
    return res.status(200).json({ answers });
  } catch (error) {
    console.error('Error fetching answers:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});

export default router;