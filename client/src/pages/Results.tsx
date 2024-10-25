import React from 'react';
import { useEffect, useState } from 'react';

interface ResultsProps {
  id: number
  score: number;
  totalQuestions: number;
  playAgain: () => void;
}

const Results: React.FC = () => {
  const [score, setScore] = useState<ResultsProps[]>([]);

  useEffect(() => {
    const loadResults = () => {
      const savedResults = JSON.parse(localStorage.getItem('savedResults') || '[]');
      setScore(savedResults);
    }
    loadResults();
    window.addEventListener('storage', loadResults);
    return () => {
      window.removeEventListener('storage', loadResults);
    };
  }, []);

  const playAgain = (_id:number) => {
    localStorage.removeItem('savedResults');
    setScore([]);
  }

  return (
    <>
      <h1>Results</h1>
      {score.length === 0 ? (
        <p>No results to show!</p>
      ) : (
        <div>
          <table className='table'>
            <thead>
              <tr>
                <th>Score</th>
                <th>Total Questions</th>
              </tr>
            </thead>
            <tbody>
              {score.map((result) => (
                <tr key={result.id}>
                  <td>{result.score}</td>
                  <td>{result.totalQuestions}</td>
                  <td>
                    <button onClick={() => playAgain(result.id)}>Play Again</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    
    </>
    // <div className='card'>
    //   <h1>Form</h1>
    //   <p>No results to show!</p>
    // </div>
  );
};


export default Results;