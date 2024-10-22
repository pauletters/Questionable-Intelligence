import { seedUsers } from './user-seeds.js';
import { seedQuestions } from './question-seeds.js';
import { seedCorrectAnswers } from './correct-answer-seeds.js';
import { sequelize } from '../models/index.js';

const seedAll = async (): Promise<void> => {
  try {
    await sequelize.sync({ force: true });
    console.log('\n----- DATABASE SYNCED -----\n');

    await seedUsers();
    console.log('\n----- USERS SEEDED -----\n');

    await seedQuestions();
    console.log('\n----- QUESTIONS SEEDED -----\n');

    await seedCorrectAnswers();
    console.log('\n----- CORRECT ANSWERS SEEDED -----\n');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedAll();