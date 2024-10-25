import * as dotenv from 'dotenv';
import path from 'path';
import { Sequelize } from 'sequelize';
import { UserFactory } from './user.js';
import { QuestionFactory } from './question.js';
import { AnswerFactory } from './answer.js';
import { QuizSessionFactory } from './quizSession.js';

// Load environment variables
const envPath = path.resolve(process.cwd(), '.env');
dotenv.config({ path: envPath });

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
const Answer = AnswerFactory(sequelize);
const QuizSession = QuizSessionFactory(sequelize);

// Define relationships with consistent aliasing
User.hasMany(Answer, { foreignKey: 'userId', as: 'answers' });  // Alias set to 'answers'
Question.hasMany(Answer, { foreignKey: 'questionId', as: 'questionAnswers' });
Answer.belongsTo(User, { foreignKey: 'userId', as: 'user' });
Answer.belongsTo(Question, { foreignKey: 'questionId', as: 'question' });

User.hasMany(QuizSession, { foreignKey: 'userId', as: 'quizSessions' });
QuizSession.belongsTo(User, { foreignKey: 'userId', as: 'user' });

QuizSession.hasMany(Answer, { foreignKey: 'quizSessionId', as: 'sessionAnswers' });
Answer.belongsTo(QuizSession, { foreignKey: 'quizSessionId', as: 'quizSession' });

// Export Sequelize instance and models
export { sequelize, User, Question, Answer, QuizSession };
export * from './user.js';
export * from './question.js';
export * from './answer.js';
export * from './quizSession.js';
