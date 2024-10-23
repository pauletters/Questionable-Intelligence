import { User } from '../models/user.js';


export const seedUsers = async () => {
  

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
