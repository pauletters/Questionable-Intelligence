import React from 'react';
import { useState, useEffect } from 'react';


interface Hallofshame {
  id: number;
  username: string;
  score: number;  
  violations: number;
}

const HallOfShame: React.FC = () => {
  const [HallOfShame, setHallOfShame] = useState<Hallofshame[]>([]);

  useEffect(() => {
    const loadHallOfShame = () => {
      const HallOfShame = JSON.parse(localStorage.getItem('HallOfShame') || '[]');
      setHallOfShame(HallOfShame);
    }
    loadHallOfShame();
    window.addEventListener('storage', loadHallOfShame);
    return () => {
      window.removeEventListener('storage', loadHallOfShame);
    };
  }, []);

  const getBadgeIcon = (violations: number) => {
    if (violations > 5) {
      return <img 
      src="https://github.com/pauletters/Questionable-Intelligence/blob/main/public/images/badge%20temp.png?raw=true" 
      alt="High Violations" />;
    }
    return null;
  }

  return (
    <>
      <h1>Hall of Shame</h1>
      {HallOfShame.length === 0 ? (
        <p>Here are the worst of the worst.... coming soon!</p>
      ):(
        <div>
          <table className='table'>
            <thead>
              <tr>
                <th>Username</th>
                <th>Score</th>
                <th>Violations</th>
              </tr>
            </thead>
            <tbody>
              {HallOfShame.map((user) => (
                <tr key={user.username}>
                  <td>{user.username}</td>
                  <td>{user.score}</td>
                  <td>{user.violations}</td>
                  <td>{getBadgeIcon(user.violations)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
};

export default HallOfShame;