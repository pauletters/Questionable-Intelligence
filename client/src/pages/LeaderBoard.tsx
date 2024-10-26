import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface UserStats {
  username: string;
  totalQuestions: number;
  correctAnswers: number;
  correctPercentage: number;
}

const LeaderBoard: React.FC = () => {
  const [userStats, setUserStats] = useState<UserStats[]>([]);
  const [sortConfig, setSortConfig] = useState<{ key: keyof UserStats; direction: 'ascending' | 'descending' } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserStats = async () => {
      const token = localStorage.getItem('id_token');

      if (!token) {
        console.error('No token found, redirecting to login');
        navigate('/login'); // Redirect to login if no token is available
        return;
      }

      try {
        const response = await fetch('/api/leaderboard', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.status === 401) {
          console.error('Unauthorized: Token may be invalid or expired');
          navigate('/login'); // Redirect to login if unauthorized
          return;
        }

        if (!response.ok) {
          throw new Error('Failed to fetch leaderboard data');
        }

        const data = await response.json();
        console.log('Leaderboard data:', data); // Log data to inspect response

        const formattedData = data.map((user: any) => ({
          username: user.username,
          totalQuestions: user.totalQuestions,
          correctAnswers: user.correctAnswers,
          correctPercentage: user.totalQuestions > 0 ? ((user.correctAnswers / user.totalQuestions) * 100) : 0,
        }));
        
        setUserStats(formattedData);
        setError(null); // Clear any previous errors
      } catch (error) {
        console.error('Failed to fetch leaderboard data:', error);
        setError('Could not load leaderboard data. Please try again later.');
      } finally {
        setLoading(false); // Ensure loading is set to false after fetch attempt
      }
    };

    fetchUserStats();
  }, [navigate]);

  const sortedUserStats = [...userStats];
  if (sortConfig !== null) {
    sortedUserStats.sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'ascending' ? -1 : 1;
      if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'ascending' ? 1 : -1;
      return 0;
    });
  }

  const requestSort = (key: keyof UserStats) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  if (loading) {
    return <p>Loading leaderboard...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  if (userStats.length === 0 && !loading) {
    return <p>No leaderboard data available.</p>;
  }

  return (
    <main>
      <div className="page-layout">
        <h1>Leaderboard</h1>
        <p>Are you winning?</p>
        <table className="leaderboard-table">
          <thead>
            <tr>
              <th onClick={() => requestSort('username')}>Username</th>
              <th onClick={() => requestSort('correctAnswers')}>Correct Answers</th>
              <th onClick={() => requestSort('totalQuestions')}>Total Questions</th>
              <th onClick={() => requestSort('correctPercentage')}>Correct Percentage</th>
            </tr>
          </thead>
          <tbody>
            {sortedUserStats.map((user, index) => (
              <tr key={index}>
                <td>{user.username}</td>
                <td>{user.correctAnswers}</td>
                <td>{user.totalQuestions}</td>
                <td>{user.correctPercentage.toFixed(2)}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
};

export default LeaderBoard;
