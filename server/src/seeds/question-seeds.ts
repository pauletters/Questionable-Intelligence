import { Question } from '../models/question.js';

export const seedQuestions = async () => {
  await Question.bulkCreate([
    { text: 'What is the capital of France?', category: 'Geography', difficulty: 'Easy' },
    { text: 'Who wrote "Pride and Prejudice"?', category: 'Literature', difficulty: 'Medium' },
    { text: 'What is the powerhouse of the cell?', category: 'Science', difficulty: 'Easy' },
    { text: 'What year did the Titanic sink?', category: 'History', difficulty: 'Medium' },
    { text: 'What is the chemical symbol for Gold?', category: 'Science', difficulty: 'Hard' },
  ]);
};