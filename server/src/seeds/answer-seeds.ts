// src/seeds/answer-seeds.ts

import { Answer } from '../models/answer.js';

export const seedAnswers = async () => {
  const answers = [
    { userId: 1, questionId: 1, quizSessionId: 1, userAnswer: 'correct', isCorrect: true, category: 'Math' },
    { userId: 2, questionId: 2, quizSessionId: 1, userAnswer: 'incorrect', isCorrect: false, category: 'Science' },
    { userId: 1, questionId: 3, quizSessionId: 2, userAnswer: 'correct', isCorrect: true, category: 'History' },
    { userId: 1, questionId: 4, quizSessionId: 2, userAnswer: 'incorrect', isCorrect: false, category: 'Math' },
    { userId: 2, questionId: 5, quizSessionId: 3, userAnswer: 'correct', isCorrect: true, category: 'Science' },
  ];

  await Answer.bulkCreate(answers);
};
