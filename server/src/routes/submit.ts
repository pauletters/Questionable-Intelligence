import { Router, Request, Response } from 'express';
import { Answer } from '../models/answer.js';
import { Question } from '../models/question.js';
import { QuizSession } from '../models/quizSession.js';  // Ensure this model is imported

const router = Router();

// POST /api/submitAnswer - Submit user's answer to a question
router.post('/', async (req: Request, res: Response) => {
  const { userId, questionId, quizSessionId, userAnswer } = req.body;

  try {
    // Step 1: Validate the quiz session exists
    const quizSession = await QuizSession.findByPk(quizSessionId);
    if (!quizSession) {
      return res.status(404).json({ message: 'Quiz session not found' });
    }

    // Step 2: Find the question by its ID
    const question = await Question.findByPk(questionId);
    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }

    // Step 3: Check if the user's answer is correct
    const isCorrect = question.correctAnswer === userAnswer;

    // Step 4: Store the answer in the database
    const answer = await Answer.create({
      userId,
      questionId,
      quizSessionId,
      userAnswer,
      isCorrect,
    });

    // Step 5: Return the result
    return res.status(201).json({ message: 'Answer submitted successfully', answer });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Error submitting answer:', error.message, error.stack);
      return res.status(500).json({ message: 'Server error', error: error.message });
    } else {
      console.error('Unknown error occurred:', error);
      return res.status(500).json({ message: 'Unknown server error' });
    }
  }
});

export default router;
