// src/controllers/hallOfShame-controller.ts
import { Request, Response } from 'express';
import { User } from '../models/user.js'; // Adjust the path as necessary
import { Answer } from '../models/answer.js'; // Adjust the path as necessary
import sequelize from 'sequelize';

export const getHallOfShame = async (_req: Request, res: Response) => {
  try {
    const usersWithViolations = await User.findAll({
      attributes: [
        'username',
        [sequelize.fn('COUNT', sequelize.col('answers.violation')), 'totalViolations'],
      ],
      include: [
        {
          model: Answer,
          as: 'answers',
          where: { violation: true },
          attributes: [],
        },
      ],
      group: ['User.id'],
      order: [[sequelize.literal('"totalViolations"'), 'DESC']],
    });

    console.log('Hall of Shame Data:', usersWithViolations); // Log data to confirm output
    res.json(usersWithViolations);
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error fetching Hall of Shame data:', error.message);
    } else {
      console.error('Error fetching Hall of Shame data:', error);
    }
    res.status(500).json({ message: 'Server error' });
  }
};
