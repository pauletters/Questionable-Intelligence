import { DataTypes, Sequelize, Model, Optional } from 'sequelize';
import { User } from './user';

interface QuizSessionAttributes {
  id: number;
  userId: number;
  startTime: Date;
}

interface QuizSessionCreationAttributes extends Optional<QuizSessionAttributes, 'id'> {}

export class QuizSession extends Model<QuizSessionAttributes, QuizSessionCreationAttributes> implements QuizSessionAttributes {
  public id!: number;
  public userId!: number;
  public startTime!: Date;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public readonly user?: User;
}

export function QuizSessionFactory(sequelize: Sequelize): typeof QuizSession {
  QuizSession.init(
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
      startTime: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      tableName: 'quiz_sessions',
      sequelize,
    }
  );
  return QuizSession;
}
