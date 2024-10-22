import { DataTypes, Sequelize, Model, Optional } from 'sequelize';

interface QuestionAttributes {
  id: number;
  text: string;
  category: string;
  difficulty: string;
}

interface QuestionCreationAttributes extends Optional<QuestionAttributes, 'id'> {}

export class Question extends Model<QuestionAttributes, QuestionCreationAttributes> implements QuestionAttributes {
  public id!: number;
  public text!: string;
  public category!: string;
  public difficulty!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export function QuestionFactory(sequelize: Sequelize): typeof Question {
  Question.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      text: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      category: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      difficulty: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      tableName: 'questions',
      sequelize,
    }
  );

  return Question;
}
