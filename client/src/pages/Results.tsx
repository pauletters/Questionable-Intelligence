import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const Results: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { quizSessionId } = location.state || { quizSessionId: null };
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [answers, setAnswers] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnswers = async () => {
      const token = localStorage.getItem('id_token');
      
      if (!token) {
        console.error('No token found, redirecting to login');
        navigate('/login');
        return;
      }

      try {
        const response = await fetch(`/api/answers/${quizSessionId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        
        if (!response.ok) {
          if (response.status === 401) {
            console.error('Unauthorized: Token may be invalid or expired');
            navigate('/login');
          } else {
            throw new Error(`Error fetching answers: ${response.statusText}`);
          }
        }

        const data = await response.json();
        setAnswers(data.answers);
        const correct = data.answers.filter((answer: any) => answer.isCorrect).length;
        setCorrectAnswers(correct);
        setTotalQuestions(data.answers.length);
      } catch (error) {
        console.error('Error fetching answers:', error);
        setError('Failed to load results.');
      }
    };

    if (quizSessionId) {
      fetchAnswers();
    }
  }, [quizSessionId, navigate]);

  return (
    <div className="results-container">
      <h1 className="results-heading">Results</h1>
      {error ? (
        <p className="error-text">{error}</p>
      ) : (
        <>
          <p className="result-text">
            You got {correctAnswers} out of {totalQuestions} correct.
          </p>
          <h2 className="results-subheading">Detailed Results</h2>
          <ul className="results-list">
            {answers.map((answer) => (
              <li key={answer.id} className="results-list-item">
                Question: {answer.questionText} - Your answer: {answer.userAnswer} - Correct answer: {answer.isCorrect ? 'Yes' : 'No'}
              </li>
            ))}
          </ul>
          <button
            className="play-again-button"
            onClick={() => navigate('/form')}
          >
            PLAY AGAIN
          </button>
        </>
      )}
    </div>
  );
};

export default Results;
