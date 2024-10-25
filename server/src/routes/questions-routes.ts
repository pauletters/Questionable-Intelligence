import { Router, Request, Response } from 'express';
import { authenticateToken } from '../middleware/auth.js';  // Middleware to validate the JWT token
import axios from 'axios';  // For fetching questions from OpenTrivia API
import { Question } from '../models/question.js';  // Import your Question model

const router = Router();

// GET /api/questions - Fetch questions from OpenTrivia API and save them to the database
router.get('/', authenticateToken, async (req: Request, res: Response) => {  // Updated the path to '/'
  const { category, difficulty, type } = req.query;

  try {
    // Fetch 10 questions from OpenTrivia API with the specified parameters
    const response = await axios.get('https://opentdb.com/api.php', {
      params: {
        amount: 10,  // Specify the number of questions
        category: category !== 'any' ? category : undefined,
        difficulty: difficulty !== 'any' ? difficulty : undefined,
        type: type !== 'any' ? type : undefined,
      },
    });

    const fetchedQuestions = response.data.results;

    if (fetchedQuestions && fetchedQuestions.length > 0) {
      const savedQuestions = [];

      for (const triviaQuestion of fetchedQuestions) {
        // Check if the question already exists in the database
        const existingQuestion = await Question.findOne({ where: { text: triviaQuestion.question } });

        if (!existingQuestion) {
          // If the question doesn't exist, save it in the database
          const newQuestion = await Question.create({
            text: triviaQuestion.question,
            category: triviaQuestion.category,
            difficulty: triviaQuestion.difficulty,
            type: triviaQuestion.type,
            correctAnswer: triviaQuestion.correct_answer,
            incorrectAnswers: triviaQuestion.incorrect_answers,
          });
          savedQuestions.push(newQuestion);  // Add the newly created question to the results
        } else {
          savedQuestions.push(existingQuestion);  // Add existing question to the results
        }
      }

      // Return the questions (either newly saved or existing)
      res.status(200).json(savedQuestions);
    } else {
      res.status(404).json({ message: 'No questions found' });
    }
  } catch (error) {
    console.error('Error fetching or saving questions:', error);
    res.status(500).json({ message: 'Error fetching or saving questions' });
  }
});

export default router;
