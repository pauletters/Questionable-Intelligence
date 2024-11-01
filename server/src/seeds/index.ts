import { seedUsers } from './user-seeds.js';
import { seedQuestions } from './question-seeds.js';
import { seedQuizSessions } from './quizSession-seeds.js';
import { seedAnswers } from './answer-seeds.js';
import { sequelize, User, Question, Answer, QuizSession } from '../models/index.js';

const seedAll = async (): Promise<void> => {
  try {
    console.log('Synchronizing database schema...');
    await sequelize.sync({ force: false }); 
    console.log('Database synchronized successfully.');

    const userCount = await User.count();
    const questionCount = await Question.count();
    const quizSessionCount = await QuizSession.count();
    const answerCount = await Answer.count();

    if (userCount === 0 && questionCount === 0 && quizSessionCount === 0 && answerCount === 0) {
      console.log('\nDatabase is empty, starting seed process...');

      await seedUsers();
      console.log('\n----- USERS SEEDED -----\n');

      await seedQuestions();
      console.log('\n----- QUESTIONS SEEDED -----\n');

      // Ensure Quiz Sessions are seeded before Answers to satisfy foreign key constraints
      await seedQuizSessions();
      console.log('\n----- QUIZ SESSIONS SEEDED -----\n');

      await seedAnswers();
      console.log('\n----- ANSWERS SEEDED -----\n');

      console.log('Seeding complete!');
    } else {
      console.log('\nDatabase already contains data, skipping seed process');
    }
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedAll();
