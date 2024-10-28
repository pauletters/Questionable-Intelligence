import { Router, Request, Response } from 'express';
import { User } from '../models/user.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

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
    const isPasswordValid = await user.validatePassword(password);  // Updated method name here
    console.log(`Password valid: ${isPasswordValid}`);

    if (!isPasswordValid) {
      console.log('Invalid password');
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Creates a token
    const token = jwt.sign(
      { id: user.id, username: user.username },
      process.env.JWT_SECRET_KEY as string,
      { expiresIn: '1hr' }
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

export const register = async (req: Request, res: Response) => {
  console.log('Register request received', req.body);
  const { username, password } = req.body;

  try {
    // Counts the number of users before registration
    const beforeCount = await User.count();
    console.log(`Total users in database before registration: ${beforeCount}`);

    // Checks if the user already exists
    const existingUser = await User.findOne({ where: { username } });
    if (existingUser) {
      console.log(`User ${username} already exists`);
      return res.status(400).json({ message: 'Username already exists' });
    }

    // Hashes the password before creating the user
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create new user with hashed password
    const newUser = await User.create({ username, password: hashedPassword });
    console.log(`User ${username} created successfully`);

    // Verify user creation by finding the user in the database
    const verifyUser = await User.findByPk(newUser.id);
    if (verifyUser) {
      console.log(`User ${username} found in database`);
      const afterCount = await User.count();
      console.log(`Total users in database after registration: ${afterCount}`);
    }

    // Return success without token (user needs to login)
    return res.status(201).json({ 
      message: 'User created successfully',
      username: newUser.username 
    });

  } catch (error) {
    console.error('Registration error:', error);
    if (error instanceof Error) {
      return res.status(500).json({
        message: 'Failed to create user',
        error: error.message,
      });
    }
    return res.status(500).json({ message: 'Failed to create user' });
  }
};

const router = Router();

// POST /login - Login a user
router.post('/login', login);

// POST /register - Register a new user
router.post('/register', register);

export default router;
