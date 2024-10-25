import { DataTypes, Sequelize, Model, Optional } from 'sequelize';

interface QuestionAttributes {
  id: number;
  text: string;
  category: string;
  difficulty: string;
  correctAnswer: string;
  incorrectAnswers: string[];
  type: string;  // Added property to differentiate between Multiple Choice and True/False
}

interface QuestionCreationAttributes extends Optional<QuestionAttributes, 'id'> {}

export class Question extends Model<QuestionAttributes, QuestionCreationAttributes> implements QuestionAttributes {
  public id!: number;
  public text!: string;
  public category!: string;
  public difficulty!: string;
  public correctAnswer!: string;
  public incorrectAnswers!: string[];
  public type!: string;  // 'multiple' or 'boolean' to represent the question type

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
      correctAnswer: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      incorrectAnswers: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: false,
      },
      type: {
        type: DataTypes.ENUM('multiple', 'boolean'),  // Define as 'multiple' or 'boolean'
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
