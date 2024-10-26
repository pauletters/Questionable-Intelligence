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

        if (!response.ok) {
          console.error(`Error: Received status ${response.status}`);
          throw new Error(`Failed to fetch user stats, status: ${response.status}`);
        }

        const textResponse = await response.text();
        console.log('Raw response:', textResponse);

        // Check if response is JSON
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          const data = JSON.parse(textResponse);
          setUserStats(data);
        } else {
          console.error("Expected JSON, but received HTML or another format.");
          throw new Error("Invalid response format");
        }
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
        <div className="stats-grid">
          <div className="stat-card">
            <h3>Username</h3>
            <p>{userStats.username}</p>
          </div>

          <div className="stat-card">
            <h3>Questions Answered</h3>
            <p>{userStats.questionsAnswered}</p>
          </div>

          <div className="stat-card">
            <h3>Success Rate</h3>
            <p>{userStats.percentageCorrect}%</p>
          </div>

          <div className="stat-card">
            <h3>Best Category</h3>
            <p className="best">{userStats.bestCategory || 'N/A'}</p>
          </div>

          <div className="stat-card">
            <h3>Worst Category</h3>
            <p className="worst">{userStats.worstCategory || 'N/A'}</p>
          </div>
        </div>

        <div className="button-container">
          <button onClick={() => window.location.reload()} className="refresh-button">
            Refresh Stats
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserAccount;
