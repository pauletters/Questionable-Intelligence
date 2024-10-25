import { DataTypes, Sequelize, Model, Optional } from 'sequelize';
import { User } from './user';
import { Question } from './question';
import { QuizSession } from './quizSession.js'; // Ensure the file 'quizSession.ts' exists in the same directory

interface AnswerAttributes {
  id: number;
  userId: number;
  questionId: number;
  quizSessionId: number;
  userAnswer: string;
  isCorrect: boolean;
}

interface AnswerCreationAttributes extends Optional<AnswerAttributes, 'id'> {}

export class Answer extends Model<AnswerAttributes, AnswerCreationAttributes> implements AnswerAttributes {
  public id!: number;
  public userId!: number;
  public questionId!: number;
  public quizSessionId!: number;
  public userAnswer!: string;
  public isCorrect!: boolean;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public readonly user?: User;
  public readonly question?: Question;
  public readonly quizSession?: QuizSession;  // Link to QuizSession model
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
    },
    {
      tableName: 'answers',
      sequelize,
    }
  );
  return Answer;
}
