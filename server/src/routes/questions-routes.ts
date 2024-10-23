import { Router, Request, Response } from 'express';
import axios from 'axios';
import { Question } from '../models/question.js';  // Import the Question model

const router = Router();

// Type for the Open Trivia Database API response question format
interface TriviaQuestion {
  question: string;
  category: string;
  difficulty: string;
  type: string;
  correct_answer: string;
  incorrect_answers: string[];
}

// Route to fetch and store questions from Open Trivia API
router.get('/', async (req: Request, res: Response) => {
  const { amount, category, difficulty } = req.query;

  try {
    // Fetch questions from the Open Trivia Database API
    const response = await axios.get('https://opentdb.com/api.php', {
      params: {
        amount,
        category,
        difficulty,
      },
    });

    const questions: TriviaQuestion[] = response.data.results;

    // Array to hold new questions that will be inserted into the database
    const newQuestions = [];

    // Loop through each question and check for duplicates
    for (const question of questions) {
      const existingQuestion = await Question.findOne({ where: { text: question.question } });

      // If the question doesn't exist, add it to the newQuestions array
      if (!existingQuestion) {
        const newQuestion = {
          text: question.question,
          category: question.category,
          difficulty: question.difficulty,
          type: question.type,  // 'multiple' or 'boolean'
          correctAnswer: question.correct_answer,  // Correct answer
          incorrectAnswers: question.incorrect_answers,  // Incorrect answers as an array
        };
        newQuestions.push(newQuestion);
      }
    }

    // Bulk insert new questions into the database
    if (newQuestions.length > 0) {
      await Question.bulkCreate(newQuestions);
      res.status(201).json({ message: `${newQuestions.length} new questions saved`, newQuestions });
    } else {
      res.status(200).json({ message: 'No new questions to save' });
    }
  } catch (error) {
    console.error('Error fetching or saving questions:', error);
    res.status(500).json({ message: 'Error fetching or saving questions' });
  }
});

export default router;