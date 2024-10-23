import { User } from '../models/user.js';
import bcrypt from 'bcrypt';

export const seedUsers = async () => {
  const saltRounds = 10;

  const userCount = await User.count();
  if (userCount > 0) {
    console.log(`Skipping user seeding - ${userCount} users already exist`);
    return;
  }

  // Hash the passwords
  const hashedUsers = await Promise.all([
    {
      username: 'john_doe',
      password: await bcrypt.hash('password123', saltRounds),  // Hashing the password
    },
    {
      username: 'jane_doe',
      password: await bcrypt.hash('password123', saltRounds),  // Hashing the password
    },
    {
      username: 'admin_user',
      password: await bcrypt.hash('adminpass', saltRounds),    // Hashing the password
    },
  ]);

  // Seed the users with hashed passwords
  const createdUsers = await User.bulkCreate(hashedUsers);
  console.log(`Created ${createdUsers.length} initial users`);
};