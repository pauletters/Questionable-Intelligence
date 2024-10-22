import { DataTypes, Sequelize, Model, Optional } from 'sequelize';
import { User } from './user';
import { Question } from './question';

interface CorrectAnswerAttributes {
  id: number;
  violation: boolean;
  userId: number;
  questionId: number;
}

interface CorrectAnswerCreationAttributes extends Optional<CorrectAnswerAttributes, 'id'> {}

export class CorrectAnswer extends Model<CorrectAnswerAttributes, CorrectAnswerCreationAttributes> implements CorrectAnswerAttributes {
  public id!: number;
  public violation!: boolean;
  public userId!: number;
  public questionId!: number;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // associated models
  public readonly user?: User;
  public readonly question?: Question;
}

export function CorrectAnswerFactory(sequelize: Sequelize): typeof CorrectAnswer {
  CorrectAnswer.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      violation: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'users', // 'users' refers to table name
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
    },
    {
      tableName: 'correct_answers',
      sequelize,
    }
  );

  return CorrectAnswer;
}
