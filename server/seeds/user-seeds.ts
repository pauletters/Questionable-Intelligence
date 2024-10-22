import { User } from '../models/user';
import bcrypt from 'bcrypt';

export const seedUsers = async () => {
  const saltRounds = 10;

  await User.bulkCreate([
    {
      username: 'john_doe',
      password: await bcrypt.hash('password123', saltRounds),
    },
    {
      username: 'jane_doe',
      password: await bcrypt.hash('password123', saltRounds),
    },
    {
      username: 'admin_user',
      password: await bcrypt.hash('adminpass', saltRounds),
    },
  ]);
};