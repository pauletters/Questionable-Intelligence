import * as dotenv from 'dotenv';
import path from 'path';
import { Sequelize } from 'sequelize';
import { UserFactory } from './user.js';
import { QuestionFactory } from './question.js';
import { CorrectAnswerFactory } from './correctAnswer.js';

const envPath = path.resolve(process.cwd(), '.env');
dotenv.config({ path: envPath});

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
const CorrectAnswer = CorrectAnswerFactory(sequelize);

// Define relationships
User.hasMany(CorrectAnswer, { foreignKey: 'userId' });
Question.hasMany(CorrectAnswer, { foreignKey: 'questionId' });
CorrectAnswer.belongsTo(User, { foreignKey: 'userId' });
CorrectAnswer.belongsTo(Question, { foreignKey: 'questionId' });

// Export Sequelize instance and models
export { sequelize, User, Question, CorrectAnswer };