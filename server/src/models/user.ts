import { DataTypes, Sequelize, Model, Optional, Association, HasManyGetAssociationsMixin } from 'sequelize';
import bcrypt from 'bcrypt';
import { Answer } from './answer.js';

interface UserAttributes {
  id: number;
  username: string;
  password: string;
  totalQuestions?: number; // Optional as it's a virtual field
  correctAnswers?: number;  // Optional as it's a virtual field
  correctPercentage?: number; // Optional as it's a virtual field
}

interface UserCreationAttributes extends Optional<UserAttributes, 'id'> {}

export class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  public id!: number;
  public username!: string;
  public password!: string;

  // Virtual fields
  public totalQuestions!: number;  // Virtual field
  public correctAnswers!: number;   // Virtual field
  public correctPercentage!: number; // Virtual field

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Association with Answer model
  public getAnswers!: HasManyGetAssociationsMixin<Answer>;
  public answers?: Answer[];

  public static override associations: {
    answers: Association<User, Answer>;
  };

  // Method to hash the password before saving the user
  public async setHashedPassword(password: string) {  
    const saltRounds = 10;
    this.password = await bcrypt.hash(password, saltRounds);
  }

  // Define validatePassword as an instance method
  public async validatePassword(loginPassword: string): Promise<boolean> {  
    return bcrypt.compare(loginPassword, this.password);
  }
}

export function UserFactory(sequelize: Sequelize): typeof User {
  User.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      totalQuestions: {
        type: DataTypes.VIRTUAL,  // Define as virtual field
      },
      correctAnswers: {
        type: DataTypes.VIRTUAL,  // Define as virtual field
      },
      correctPercentage: {
        type: DataTypes.VIRTUAL,  // Define as virtual field
      },
    },
    {
      tableName: 'users',
      sequelize,
      hooks: {
        // Before creating a new user, hash the password
        beforeCreate: async (user: User) => {
          await user.setHashedPassword(user.password);  
        },
        // Before updating an existing user, hash the password if it was changed
        beforeUpdate: async (user: User) => {
          if (user.changed('password')) {
            await user.setHashedPassword(user.password);  
          }
        },
      },
    }
  );

  return User;
}
