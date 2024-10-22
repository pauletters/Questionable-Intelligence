import dotenv from 'dotenv';
dotenv.config();

import { Sequelize } from 'sequelize';
import { UserFactory } from './user';
import { QuestionFactory } from './question';
import { CorrectAnswerFactory } from './correctAnswer';

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