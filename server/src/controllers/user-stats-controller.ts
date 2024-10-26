// src/controllers/user-stats-controller.ts
import { Request, Response } from 'express';
import { User, Answer, sequelize } from '../models/index.js';

// Define custom types for the data structure returned by Sequelize aggregations
interface UserStatsAttributes {
  username: string;
  questionsAnswered: number;
  correctAnswers: number;
  percentageCorrect: number;
  bestCategory?: string;
  worstCategory?: string;
}


export const getUserStats = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized user' });
      return;
    }

    const userId = req.user.id;

    // Fetch general statistics for the user
    const userStats = await User.findOne({
      where: { id: userId },
      attributes: [
        'username',
        [sequelize.fn('COUNT', sequelize.col('answers.id')), 'questionsAnswered'],
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
        `), 'percentageCorrect'],
      ],
      include: [{
        model: Answer,
        as: 'answers',
        attributes: [],
      }],
      group: ['User.id'],
    });

    if (!userStats) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    // Fetch best and worst categories
    const categoryStats = await Answer.findAll({
      attributes: [
        'category',
        [sequelize.fn('COUNT', sequelize.col('id')), 'totalQuestions'],
        [
          sequelize.fn(
            'SUM',
            sequelize.literal('CASE WHEN "isCorrect" = true THEN 1 ELSE 0 END')
          ),
          'correctAnswers',
        ],
      ],
      where: { userId },
      group: ['category'],
      having: sequelize.where(sequelize.fn('COUNT', sequelize.col('id')), '>', 0),
    });

    // Calculate best and worst categories
    let bestCategory = { category: '', percentage: 0 };
    let worstCategory = { category: '', percentage: 100 };

    categoryStats.forEach((categoryStat: any) => {
      const totalQuestions = categoryStat.getDataValue('totalQuestions');
      const correctAnswers = categoryStat.getDataValue('correctAnswers') || 0;
      const percentage = totalQuestions ? (correctAnswers / totalQuestions) * 100 : 0;

      if (percentage > bestCategory.percentage) {
        bestCategory = { category: categoryStat.getDataValue('category'), percentage };
      }
      if (percentage < worstCategory.percentage) {
        worstCategory = { category: categoryStat.getDataValue('category'), percentage };
      }
    });

    const responseStats: UserStatsAttributes = {
      username: userStats.getDataValue('username'),
      questionsAnswered: Number((userStats as any).getDataValue('questionsAnswered')) ?? 0,
      correctAnswers: userStats.getDataValue('correctAnswers') ?? 0,
      percentageCorrect: Number((userStats as any).getDataValue('percentageCorrect')) ?? 0,
      bestCategory: bestCategory.category,
      worstCategory: worstCategory.category,
    };

    res.json(responseStats);
  } catch (error) {
    console.error('Error fetching user stats:', error);
    res.status(500).json({ error: 'Server error' });
  }
};
