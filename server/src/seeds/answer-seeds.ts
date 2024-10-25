import { Answer } from '../models/answer.js';

export const seedAnswers = async () => {
  await Answer.bulkCreate([
    { userId: 1, questionId: 1, quizSessionId: 1, userAnswer: 'correct', isCorrect: true },
    { userId: 2, questionId: 2, quizSessionId: 1, userAnswer: 'incorrect', isCorrect: false },
    { userId: 1, questionId: 3, quizSessionId: 2, userAnswer: 'correct', isCorrect: true },
    { userId: 1, questionId: 4, quizSessionId: 2, userAnswer: 'incorrect', isCorrect: false },
    { userId: 2, questionId: 5, quizSessionId: 3, userAnswer: 'correct', isCorrect: true },
  ]);
};
