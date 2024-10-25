import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

// Utility function to decode HTML entities (for special characters like apostrophes)
const decodeHtmlEntities = (text: string) => {
  const textArea = document.createElement('textarea');
  textArea.innerHTML = text;
  return textArea.value;
};

const QuestionPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { questions, userId, quizSessionId } = location.state || { questions: [], userId: null, quizSessionId: null };
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId || !quizSessionId || !questions || questions.length === 0) {
      console.error('User ID, quiz session ID, or questions are missing, redirecting to login');
      navigate('/login');
      return;
    }
  }, [userId, quizSessionId, navigate, questions]);
  
  const handleAnswerSubmit = async () => {
    const token = localStorage.getItem('id_token');

    if (!token) {
      console.error('No token found, redirecting to login');
      navigate('/login');
      return;
    }

    if (selectedAnswer === '') {
      alert('Please select an answer before submitting.');
      return;
    }

    if (currentIndex >= questions.length) {
      console.error('Current index exceeds the number of questions');
      return;
    }

    const currentQuestion = questions[currentIndex];
    const questionId = currentQuestion?.id;

    if (!questionId) {
      console.error('Question ID is null or undefined');
      return;
    }

    const isCorrect = selectedAnswer === currentQuestion.correctAnswer;
  
    try {
      const response = await fetch('/api/submitAnswer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          userId,
          questionId,
          quizSessionId,
          userAnswer: selectedAnswer,
          isCorrect,
        }),
      });

      if (response.status === 401) {
        console.error('Unauthorized: Token may be invalid or expired');
        navigate('/login');
      } else if (!response.ok) {
        console.error('Failed to submit answer:', response.statusText);
      } else {
        await response.json();
      }
    } catch (error) {
      console.error('Error submitting answer:', error);
      setError('An error occurred while submitting the answer');
    }

    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setSelectedAnswer('');
    } else {
      navigate('/results', { state: { userId, quizSessionId } });
    }
  };

  if (!questions || questions.length === 0) {
    return <div>No questions available</div>;
  }

  const currentQuestion = questions[currentIndex];
  const correctAnswer = currentQuestion?.correctAnswer || '';
  const incorrectAnswers = Array.isArray(currentQuestion?.incorrectAnswers) ? currentQuestion.incorrectAnswers : [];
  const choices = shuffleArray([correctAnswer, ...incorrectAnswers]);

  function shuffleArray(array: string[]) {
    return array.sort(() => Math.random() - 0.5);
  }

  return (
    <div className="question-container">
      <h1 className="question-heading">Question {currentIndex + 1}</h1>
      <p className="question-text">
        {decodeHtmlEntities(currentQuestion?.text || "Loading question...")}
      </p>

      {error && <p className="error-text">{error}</p>}

      <select
        value={selectedAnswer}
        onChange={(e) => setSelectedAnswer(e.target.value)}
        className="select-box"
      >
        <option value="">Select an answer</option>
        {choices.map((choice: string) => (
          <option key={choice} value={choice}>{decodeHtmlEntities(choice)}</option>
        ))}
      </select>

      <button className="submit-button" onClick={handleAnswerSubmit}>Submit Answer</button>
    </div>
  );
};

export default QuestionPage;
