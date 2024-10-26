import { Request, Response } from 'express';
import { User, Answer, sequelize } from '../models/index.js';


export const getLeaderboardData = async (_req: Request, res: Response) => {
  try {
    const leaderboardData = await User.findAll({
      attributes: [
        'username',
        [sequelize.fn('COUNT', sequelize.col('answers.id')), 'totalQuestions'],
        [
          sequelize.fn(
            'SUM',
            sequelize.literal('CASE WHEN "answers"."isCorrect" = true THEN 1 ELSE 0 END')
          ),
          'correctAnswers',
        ],
        [sequelize.literal(`
          CASE 
            WHEN COUNT("answers"."id") > 0 THEN 
              (SUM(CASE WHEN "answers"."isCorrect" = true THEN 1 ELSE 0 END) * 100.0 / COUNT("answers"."id")) 
            ELSE 0 
          END
        `), 'correctPercentage'],
      ],
      include: [
        {
          model: Answer,
          as: 'answers',
          attributes: [],  // Don't fetch individual answer fields
        },
      ],
      group: ['User.id'],
      order: [[sequelize.literal('"correctPercentage"'), 'DESC']],  // Quote the alias here
    });

    // Format the response as needed
    const formattedData = leaderboardData.map(user => {
      return {
        username: user.username,
        totalQuestions: user.getDataValue('totalQuestions'),
        correctAnswers: user.getDataValue('correctAnswers'),
        correctPercentage: user.getDataValue('correctPercentage'),
      };
    });

    res.json(formattedData);
  } catch (error) {
    console.error('Error fetching leaderboard data:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
