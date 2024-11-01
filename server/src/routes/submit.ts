// src/routes/answer-routes.ts
import { Router, Request, Response } from 'express';
import { Answer } from '../models/answer.js';
import { Question } from '../models/question.js';

const router = Router();

// POST /api/answers/submit - Submit an answer for a question
router.post('/submit', async (req: Request, res: Response) => {
  const { answer, violation, quizSessionId, questionId } = req.body;
  const userId = req.user?.id; // Make sure req.user is populated with user ID, typically through a middleware

  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized user' });
  }

  if (!answer || !quizSessionId || !questionId) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    // Fetch the correct answer from the Question model
    const question = await Question.findByPk(questionId);

    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }

    // Compare the provided answer with the correct answer
    const isCorrect = answer === question.correctAnswer;

    // Save the answer with the violation status
    const newAnswer = await Answer.create({
      userId,
      questionId,
      quizSessionId,
      userAnswer: answer,
      isCorrect,
      violation,
      category: question.category
    });

    return res.status(201).json({ message: 'Answer submitted', newAnswer });
  } catch (error) {
    console.error('Error submitting answer:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/answers/:quizSessionId - Fetch answers for a specific quiz session
router.get('/:quizSessionId', async (req: Request, res: Response) => {
  const { quizSessionId } = req.params;

  try {
    // Fetch all answers for the given quiz session, including the related question data
    const answers = await Answer.findAll({
      where: { quizSessionId },
      include: [
        {
          model: Question,
          as: 'question',
          attributes: ['text', 'correctAnswer'], // Ensure these fields match your model
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
