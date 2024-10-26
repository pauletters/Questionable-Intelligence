import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

// Utility function to decode HTML entities (for special characters like apostrophes)
const decodeHtmlEntities = (text: string) => {
  const textArea = document.createElement('textarea');
  textArea.innerHTML = text;
  return textArea.value;
};

interface QuestionPageProps {

  onSubmitAnswer: (answer: string, violation: boolean, quizSessionId: string, questionId: string) => Promise<void>;

}

const QuestionPage: React.FC<QuestionPageProps> = ({ onSubmitAnswer }) => {
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
    if (selectedAnswer === '') {
      alert('Please select an answer before submitting.');
      return;
    }

    if (currentIndex >= questions.length) {
      console.error('Current index exceeds the number of questions');
      return;
    }


    try {
      // Call the submitAnswer function passed in through props
      await onSubmitAnswer(selectedAnswer, false, quizSessionId, currentQuestion.id); // Assuming no violation for now
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
