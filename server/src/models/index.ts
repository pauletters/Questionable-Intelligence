import * as dotenv from 'dotenv';
import path from 'path';
import { Sequelize } from 'sequelize';
import { UserFactory } from './user.js';
import { QuestionFactory } from './question.js';
import { AnswerFactory } from './answer.js';
import { QuizSessionFactory } from './quizSession.js';  // Import QuizSession

// Load environment variables
const envPath = path.resolve(process.cwd(), '.env');
dotenv.config({ path: envPath });

// Log DB connection details for debugging
console.log('DB_URL:', process.env.DB_URL);
console.log('DB_NAME:', process.env.DB_NAME);
console.log('DB_USER:', process.env.DB_USER);
console.log('DB_PASSWORD:', process.env.DB_PASSWORD);

// Initialize Sequelize instance
const sequelize = process.env.DB_URL
  ? new Sequelize(process.env.DB_URL)
  : new Sequelize(process.env.DB_NAME || '', process.env.DB_USER || '', process.env.DB_PASSWORD, {
      host: 'localhost',
      dialect: 'postgres',
      dialectOptions: {
        decimalNumbers: true,
      },
    });

// Initialize models with Sequelize instance
const User = UserFactory(sequelize);
const Question = QuestionFactory(sequelize);
const Answer = AnswerFactory(sequelize);  // Updated name for consistency
const QuizSession = QuizSessionFactory(sequelize);  // Initialize QuizSession

// Define relationships
User.hasMany(Answer, { foreignKey: 'userId' });
Question.hasMany(Answer, { foreignKey: 'questionId' });
Answer.belongsTo(User, { foreignKey: 'userId' });
Answer.belongsTo(Question, { foreignKey: 'questionId' });

User.hasMany(QuizSession, { foreignKey: 'userId' });  // A user can have many quiz sessions
QuizSession.belongsTo(User, { foreignKey: 'userId' });  // Each quiz session belongs to a user

QuizSession.hasMany(Answer, { foreignKey: 'quizSessionId' });  // A quiz session can have many answers
Answer.belongsTo(QuizSession, { foreignKey: 'quizSessionId' });  // Each answer belongs to a quiz session

// Export Sequelize instance and models
export { sequelize, User, Question, Answer, QuizSession };
