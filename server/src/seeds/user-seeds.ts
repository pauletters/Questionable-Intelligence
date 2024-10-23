import { User } from '../models/user.js';
//import bcrypt from 'bcrypt';

export const seedUsers = async () => {
  //const saltRounds = 10;

  await User.bulkCreate([
    {
      username: 'john_doe',
      password: 'password123',
    },
    {
      username: 'jane_doe',
      password: 'password123',
    },
    {
      username: 'admin_user',
      password: 'adminpass',
    },
  ]);
};