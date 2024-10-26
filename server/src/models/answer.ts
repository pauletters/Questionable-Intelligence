import { DataTypes, Sequelize, Model, Optional } from 'sequelize';
import { User } from './user.js';
import { Question } from './question.js';
import { QuizSession } from './quizSession.js';

export interface AnswerAttributes {
  id: number;
  userId: number;
  questionId: number;
  quizSessionId: number;
  userAnswer: string;
  isCorrect: boolean;
  violation: boolean; // Tracks if user switched focus or violated the quiz rules
  category?: string;  // Optional, if category is based on the question's category
}

interface AnswerCreationAttributes extends Optional<AnswerAttributes, 'id'> {}

export class Answer extends Model<AnswerAttributes, AnswerCreationAttributes> implements AnswerAttributes {
  public id!: number;
  public userId!: number;
  public questionId!: number;
  public quizSessionId!: number;
  public userAnswer!: string;
  public isCorrect!: boolean;
  public violation!: boolean;
  public category?: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Associations with other models
  public readonly user?: User;
  public readonly question?: Question;
  public readonly quizSession?: QuizSession;
}

export function AnswerFactory(sequelize: Sequelize): typeof Answer {
  Answer.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
      },
      questionId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'questions',
          key: 'id',
        },
      },
      quizSessionId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'quiz_sessions',
          key: 'id',
        },
      },
      userAnswer: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      isCorrect: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
      violation: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      category: {
        type: DataTypes.STRING,
        allowNull: true, // Optional field
      },
    },
    {
      tableName: 'answers',
      sequelize,
    }
  );

  return Answer;
}
