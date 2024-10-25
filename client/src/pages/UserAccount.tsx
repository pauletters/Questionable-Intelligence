import React from 'react';
import Auth from '../utils/auth';
import { useState, useEffect } from 'react';

interface UserStats {
  username: string;
  gamesCompleted: number;
  percentageCorrect: number;
  bestCategory: string;
  worstCategory: string;
  violations: number;
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
          return setError('Failed to load user statistics');
        }

        const data = await response.json();
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
        
        {/* User Avatar/Icon Section */}
        <div className="avatar-container">
          <div className="avatar">
            <span>{userStats.username.charAt(0).toUpperCase()}</span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="stats-grid">
          {/* Username */}
          <div className="stat-card">
            <h3>Username</h3>
            <p>{userStats.username}</p>
          </div>

          {/* Games Completed */}
          <div className="stat-card">
            <h3>Games Completed</h3>
            <p>{userStats.gamesCompleted}</p>
          </div>

          {/* Success Rate */}
          <div className="stat-card">
            <h3>Success Rate</h3>
            <p>{userStats.percentageCorrect}%</p>
          </div>

          {/* Best Category */}
          <div className="stat-card">
            <h3>Best Category</h3>
            <p className="best">{userStats.bestCategory}</p>
          </div>

          {/* Worst Category */}
          <div className="stat-card">
            <h3>Worst Category</h3>
            <p className="worst">{userStats.worstCategory}</p>
          </div>

          {/* Violations */}
          <div className="stat-card">
            <h3>Violations</h3>
            <p className="violations">{userStats.violations}</p>
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