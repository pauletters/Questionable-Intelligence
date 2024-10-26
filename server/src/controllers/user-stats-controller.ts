import { Request, Response } from 'express';
import { User, Answer, sequelize } from '../models/index.js';

export const getUserStats = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(400).json({ message: 'User information is missing from the request' });
      return;
    }

    const userId = req.user.id; // Assuming user ID is available in the request object

    // Fetching user statistics
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
        // Calculate the percentage correct overall
        [sequelize.literal(`
          CASE 
            WHEN COUNT("answers"."id") > 0 THEN 
              (SUM(CASE WHEN "answers"."isCorrect" = true THEN 1 ELSE 0 END) * 100.0 / COUNT("answers"."id")) 
            ELSE 0 
          END
        `), 'percentageCorrect'],
      ],
      include: [
        {
          model: Answer,
          as: 'answers',
          attributes: [],
        },
      ],
      group: ['User.id'],
    });

    if (!userStats) {
      res.status(404).json({ message: 'User not found' });
      return; // Ensure you return after sending a response
    }

    // Fetch the best and worst categories
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
      having: sequelize.where(sequelize.fn('COUNT', sequelize.col('id')), '>', 0), // Only consider categories with questions answered
    });

    // Calculate percentages and determine best/worst categories
    let bestCategory = { category: '', percentage: 0 };
    let worstCategory = { category: '', percentage: 100 }; // Start worst category at 100%

    categoryStats.forEach((category) => {
      const totalQuestions = category.getDataValue('totalQuestions');
      const correctAnswers = category.getDataValue('correctAnswers') || 0;
      const percentage = totalQuestions ? (correctAnswers / totalQuestions) * 100 : 0;

      if (percentage > bestCategory.percentage) {
        bestCategory = { category: category.getDataValue('category') as string, percentage };
      }
      if (percentage < worstCategory.percentage) {
        worstCategory = { category: category.getDataValue('category') as string, percentage };
      }
    });

    // Prepare the response object
    const responseStats = {
      ...userStats.get(),
      bestCategory: bestCategory.category,
      worstCategory: worstCategory.category,
    };

    res.json(responseStats);
  } catch (error) {
    console.error('Error fetching user stats:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
