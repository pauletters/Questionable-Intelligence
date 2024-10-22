import { Router, Request, Response } from 'express';
import { User } from '../models/user.js';
import jwt from 'jsonwebtoken';

export const login = async (req: Request, res: Response) => {
  console.log('Login request received', req.body);
  const { username, password } = req.body;
  console.log(`Login attempt for user: ${username}`);

  try {
    // Finds the user by username
    const user = await User.findOne({ where: { username } });
    console.log('User found:', user ? 'Yes' : 'No');

    if (!user) {
      console.log(`User ${username} not found`);
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Checks if the password is valid
    const isPasswordValid = await user.checkPassword(password);
    console.log(`Password valid: ${isPasswordValid}`);

    if (!isPasswordValid) {
      console.log('Invalid password');
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Creates a token
    const token = jwt.sign(
      {id: user.id, username: user.username},
      process.env.JWT_SECRET_KEY as string,
      {expiresIn: '1hr'}
    );
    console.log('Token generated successfully');

    // Returns the token
    console.log(`User ${username} successfully logged in`);
    return res.json({ token });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ message: 'A login error occurred' });
  }
};

const router = Router();

// POST /login - Login a user
router.post('/login', login);

export default router;
