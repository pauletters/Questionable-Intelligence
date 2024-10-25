import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const categories = [
  { id: '9', name: 'General Knowledge' },
  { id: '10', name: 'Entertainment: Books' },
  { id: '11', name: 'Entertainment: Film' },
  { id: '12', name: 'Entertainment: Music' },
  { id: '13', name: 'Entertainment: Musicals & Theatres' },
  { id: '14', name: 'Entertainment: Television' },
  { id: '15', name: 'Entertainment: Video Games' },
  { id: '16', name: 'Entertainment: Board Games' },
  { id: '17', name: 'Science & Nature' },
  { id: '18', name: 'Science: Computers' },
  { id: '19', name: 'Science: Mathematics' },
  { id: '20', name: 'Mythology' },
  { id: '21', name: 'Sports' },
  { id: '22', name: 'Geography' },
  { id: '23', name: 'History' },
  { id: '24', name: 'Politics' },
  { id: '25', name: 'Art' },
  { id: '26', name: 'Animals' },
  { id: '27', name: 'Vehicles' },
  { id: '28', name: 'Entertainment: Comics' },
  { id: '29', name: 'Science: Gadgets' },
  { id: '30', name: 'Entertainment: Japanese Anime & Manga' },
  { id: '31', name: 'Entertainment: Cartoon & Animations' },
];

const Form: React.FC = () => {
  const navigate = useNavigate();

  const [selectedCategory, setSelectedCategory] = useState<string>('any');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('any');
  const [selectedType, setSelectedType] = useState<string>('any');

  const handleGenerate = async () => {
    const token = localStorage.getItem('id_token');
    const userId = localStorage.getItem('userId');

    if (!token || !userId) {
      console.error('User ID or token is missing, redirecting to login');
      navigate('/login');
      return;
    }

    try {
      const response = await fetch('/api/quizSessions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          category: selectedCategory !== 'any' ? selectedCategory : null,
          difficulty: selectedDifficulty !== 'any' ? selectedDifficulty : null,
          type: selectedType !== 'any' ? selectedType : null,
          userId,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create quiz session');
      }

      const data = await response.json();
      const questionsResponse = await fetch(`/api/questions?category=${selectedCategory}&difficulty=${selectedDifficulty}&type=${selectedType}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const questionsData = await questionsResponse.json();
      
      if (questionsData && questionsData.length > 0) {
        navigate('/QuestionPage', {
          state: {
            userId,
            quizSessionId: data.quizSessionId,
            questions: questionsData,
          },
        });
      } else {
        console.error('No questions returned from the API');
      }
    } catch (error) {
      console.error('Error generating quiz session:', error);
    }
  };

  return (
    <div className="form-container">
      <h1 className="form-heading">Generate Quiz</h1>
      <div className="form-group">
        <label htmlFor="category">Category</label>
        <select
          id="category"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="form-selectBox"
        >
          <option value="any">Any</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="difficulty">Difficulty</label>
        <select
          id="difficulty"
          value={selectedDifficulty}
          onChange={(e) => setSelectedDifficulty(e.target.value)}
          className="form-selectBox"
        >
          <option value="any">Any</option>
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="type">Type</label>
        <select
          id="type"
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          className="form-selectBox"
        >
          <option value="any">Any</option>
          <option value="multiple">Multiple Choice</option>
          <option value="boolean">True / False</option>
        </select>
      </div>

      <button onClick={handleGenerate} className="form-button">Generate Quiz</button>
    </div>
  );
};

export default Form;
