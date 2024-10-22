import { CorrectAnswer } from '../models/correctAnswer';

export const seedCorrectAnswers = async () => {
  await CorrectAnswer.bulkCreate([
    { violation: false, userId: 1, questionId: 1 },
    { violation: false, userId: 2, questionId: 2 },
    { violation: true, userId: 1, questionId: 3 },
    { violation: false, userId: 1, questionId: 4 },
    { violation: true, userId: 2, questionId: 5 },
  ]);
};