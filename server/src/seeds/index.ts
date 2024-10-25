import { seedUsers } from './user-seeds.js';
import { seedQuestions } from './question-seeds.js';
import { seedAnswers } from './answer-seeds.js';
import { seedQuizSessions } from './quizSession-seeds.js';
import { User, Question, Answer, QuizSession } from '../models/index.js';  // Updated import for Answer

const seedAll = async (): Promise<void> => {
  try {
    // Check if we need to seed by looking for existing data
    const userCount = await User.count();
    const questionCount = await Question.count();
    const answerCount = await Answer.count();  // Updated to reflect the correct model
    const quizSessionCount = await QuizSession.count();  // Added to check for quiz sessions

    console.log('Current database state:');
    console.log(`Users: ${userCount}`);
    console.log(`Questions: ${questionCount}`);
    console.log(`Answers: ${answerCount}`);
    console.log(`Quiz Sessions: ${quizSessionCount}`);

    // Only seed if the database is empty
    if (userCount === 0 && questionCount === 0 && answerCount === 0 && quizSessionCount === 0) {
      console.log('\nDatabase is empty, starting seed process...');

      await seedUsers();
      console.log('\n----- USERS SEEDED -----\n');

      await seedQuestions();
      console.log('\n----- QUESTIONS SEEDED -----\n');

      await seedAnswers();
      console.log('\n----- ANSWERS SEEDED -----\n');

      await seedQuizSessions();
      console.log('\n----- QUIZ SESSIONS SEEDED -----\n');  

      console.log('Seeding complete! New database state:');
      console.log(`Users: ${await User.count()}`);
      console.log(`Questions: ${await Question.count()}`);
      console.log(`Answers: ${await Answer.count()}`);
      console.log(`Quiz Sessions: ${await QuizSession.count()}`);
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
