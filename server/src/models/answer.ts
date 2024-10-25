import { DataTypes, Sequelize, Model, Optional } from 'sequelize';
import { User } from './user';
import { Question } from './question';
import { QuizSession } from './quizSession.js'; // Ensure 'quizSession.ts' exists in the same directory

// Updated interface for calculated attributes as virtual fields
export interface AnswerAttributes {
  id: number;
  userId: number;
  questionId: number;
  quizSessionId: number;
  userAnswer: string;
  isCorrect: boolean;
  category: string;
  totalQuestions?: number; // Virtual attribute
  correctAnswers?: number;  // Virtual attribute
}

interface AnswerCreationAttributes extends Optional<AnswerAttributes, 'id'> {}

export class Answer extends Model<AnswerAttributes, AnswerCreationAttributes> implements AnswerAttributes {
  public id!: number;
  public userId!: number;
  public questionId!: number;
  public quizSessionId!: number;
  public userAnswer!: string;
  public isCorrect!: boolean;
  public category!: string;

  // Calculated fields for queries, not stored in the database
  public totalQuestions?: number;
  public correctAnswers?: number;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

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
      category: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      // Virtual fields for calculation purposes
      totalQuestions: {
        type: DataTypes.VIRTUAL(DataTypes.INTEGER),
        get() {
          // Typically calculated in SQL queries, no direct getter logic here
          return null;
        },
      },
      correctAnswers: {
        type: DataTypes.VIRTUAL(DataTypes.INTEGER),
        get() {
          // Typically calculated in SQL queries, no direct getter logic here
          return null;
        },
      },
    },
    {
      tableName: 'answers',
      sequelize,
    }
  );
  return Answer;
}
