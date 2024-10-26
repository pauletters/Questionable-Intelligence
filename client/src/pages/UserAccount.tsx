import React, { useState, useEffect } from 'react';
import Auth from '../utils/auth';

interface UserStats {
  username: string;
  questionsAnswered: number;
  percentageCorrect: number;
  bestCategory: string;
  worstCategory: string;
}

const UserAccount: React.FC = () => {
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserStats = async () => {
      try {
        const token = Auth.getToken();
        if (!token) {
          throw new Error('No token found');
        }

        const response = await fetch('/api/user/stats', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
        });

        // Log the raw response for debugging
        const textResponse = await response.text(); // Get the response as text
        console.log('Raw response:', textResponse); // Log the raw response

        // If response is not ok, throw an error
        if (!response.ok) {
          throw new Error('Failed to fetch user stats');
        }

        const data = JSON.parse(textResponse); // Parse as JSON after logging
        setUserStats(data);
      } catch (err) {
        console.error('Error fetching user stats:', err);
        setError('Failed to load user statistics');
      } finally {
        setLoading(false);
      }
    };

    fetchUserStats();
  }, []);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  if (!userStats) {
    return <div className="no-data">No user data available</div>;
  }

  return (
    <div className="account-container">
      <div className="account-card">
        <h1 className="account-title">User Profile</h1>
        
      

        {/* Stats Grid */}
        <div className="stats-grid">
          {/* Username */}
          <div className="stat-card">
            <h3>Username</h3>
            <p>{userStats.username}</p>
          </div>

          {/* Questions Answered */}
          <div className="stat-card">
            <h3>Questions Answered</h3>
            <p>{userStats.questionsAnswered}</p>
          </div>

          {/* Success Rate */}
          <div className="stat-card">
            <h3>Success Rate</h3>
            <p>{userStats.percentageCorrect}%</p>
          </div>

          {/* Best Category */}
          <div className="stat-card">
            <h3>Best Category</h3>
            <p className="best">{userStats.bestCategory || 'N/A'}</p>
          </div>

          {/* Worst Category */}
          <div className="stat-card">
            <h3>Worst Category</h3>
            <p className="worst">{userStats.worstCategory || 'N/A'}</p>
          </div>
        </div>

        {/* Refresh Button */}
        <div className="button-container">
          <button 
            onClick={() => window.location.reload()}
            className="refresh-button"
          >
            Refresh Stats
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserAccount;