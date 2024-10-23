import { seedUsers } from './user-seeds.js';
import { seedQuestions } from './question-seeds.js';
import { seedCorrectAnswers } from './correct-answer-seeds.js';
import { User, Question, CorrectAnswer } from '../models/index.js';


const seedAll = async (): Promise<void> => {
  try {
    // Checks if we need to seed by looking for existing data
    const userCount = await User.count();
    const questionCount = await Question.count();
    const answerCount = await CorrectAnswer.count();

    console.log('Current database state:');
    console.log(`Users: ${userCount}`);
    console.log(`Questions: ${questionCount}`);
    console.log(`Correct Answers: ${answerCount}`);

    // Only seeds if the database is empty
    if (userCount === 0 && questionCount === 0 && answerCount === 0) {
      console.log('\nDatabase is empty, starting seed process...');

    await seedUsers();
    console.log('\n----- USERS SEEDED -----\n');

    await seedQuestions();
    console.log('\n----- QUESTIONS SEEDED -----\n');

    await seedCorrectAnswers();
    console.log('\n----- CORRECT ANSWERS SEEDED -----\n');

    console.log('Seeding complete! New database state:');
      console.log(`Users: ${await User.count()}`);
      console.log(`Questions: ${await Question.count()}`);
      console.log(`Correct Answers: ${await CorrectAnswer.count()}`);
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