import React from 'react';
import QuestionPage from '../pages/QuestionPage';

const Quiz: React.FC = () => {

  const submitAnswer = async (answer: string, violation: boolean, quizSessionId: string, questionId: string) => {
    const token = localStorage.getItem('id_token');
  
    try {
      const response = await fetch('/api/answers/submit', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          answer,
          violation,
          quizSessionId,
          questionId
        }),
      });
  
      if (!response.ok) {
        throw new Error('Failed to submit answer');
      }
  
      console.log('Answer submitted successfully');
    } catch (error) {
      console.error('Error submitting answer:', error);
    }
  };

  return (
    <div>
      <QuestionPage onSubmitAnswer={submitAnswer} />
    </div>
  );
};

export default Quiz;
