import { Router } from 'express';
import { Question } from '../models/question';  // Import your Question model

const router = Router();

// GET /api/get-answers/:id - Get shuffled answers for a given question
router.get('/get-answers/:id', async (req, res) => {
  const questionId = req.params.id;

  try {
    const question = await Question.findByPk(questionId);

    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }

    let answers: string[];

    // For multiple-choice questions, shuffle correct and incorrect answers
    if (question.type === 'multiple') {
      answers = [question.correctAnswer, ...question.incorrectAnswers];
      answers = answers.sort(() => Math.random() - 0.5); // Shuffle answers
    } else if (question.type === 'boolean') {
      answers = ['True', 'False'];
    } else {
      return res.status(400).json({ message: 'Invalid question type' });
    }

    // Ensure all code paths return a value
    return res.status(200).json({ answers });

    // Send shuffled answers to the client
    res.status(200).json({ answers });
  } catch (error) {
    console.error('Error fetching answers:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});

export default router;
