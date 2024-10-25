import { QuizSession } from '../models/quizSession.js';

export const seedQuizSessions = async () => {
  await QuizSession.bulkCreate([
    { userId: 1, startTime: new Date('2024-10-01T08:00:00Z') },
    { userId: 1, startTime: new Date('2024-10-02T08:00:00Z') },
    { userId: 2, startTime: new Date('2024-10-03T08:00:00Z') },
  ]);
};
