import { Question } from '../models/question.js';

export const seedQuestions = async () => {
  await Question.bulkCreate([
    {
      text: 'What is the capital of France?',
      category: 'Geography',
      difficulty: 'Easy',
      type: 'multiple',  // Multiple choice question
      correctAnswer: 'Paris',
      incorrectAnswers: ['London', 'Berlin', 'Madrid'],
    },
    {
      text: 'Who wrote "Pride and Prejudice"?',
      category: 'Literature',
      difficulty: 'Medium',
      type: 'multiple',  // Multiple choice question
      correctAnswer: 'Jane Austen',
      incorrectAnswers: ['Charlotte Brontë', 'Emily Brontë', 'Mary Shelley'],
    },
    {
      text: 'What is the powerhouse of the cell?',
      category: 'Science',
      difficulty: 'Easy',
      type: 'multiple',  // Multiple choice question
      correctAnswer: 'Mitochondria',
      incorrectAnswers: ['Nucleus', 'Ribosome', 'Chloroplast'],
    },
    {
      text: 'What year did the Titanic sink?',
      category: 'History',
      difficulty: 'Medium',
      type: 'multiple',  // Multiple choice question
      correctAnswer: '1912',
      incorrectAnswers: ['1913', '1911', '1905'],
    },
    {
      text: 'What is the chemical symbol for Gold?',
      category: 'Science',
      difficulty: 'Hard',
      type: 'multiple',  // Multiple choice question
      correctAnswer: 'Au',
      incorrectAnswers: ['Ag', 'Pb', 'Fe'],
    },
  ]);
};