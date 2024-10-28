import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const HallOfShame: React.FC = () => {
  const [shameData, setShameData] = useState<{ username: string; totalViolations: number }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Function to fetch Hall of Shame data with token in header
  const fetchHallOfShameData = async () => {
    const token = localStorage.getItem('id_token'); // Fetch token from localStorage

    // Redirect to login if no token
    if (!token) {
      console.error('No token found, redirecting to login');
      navigate('/login');
      return;
    }

    try {
      const response = await fetch('/api/hallOfShame', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`, // Attach token to the header
          'Content-Type': 'application/json',
        },
      });

      // Handle unauthorized response
      if (response.status === 401) {
        console.error('Unauthorized: Token may be invalid or expired');
        navigate('/login');
        return;
      }

      // Check for other response errors
      if (!response.ok) {
        throw new Error('Failed to fetch Hall of Shame data');
      }

      // Parse and set the response data
      const data = await response.json();
      console.log('Fetched Hall of Shame data:', data); // Log fetched data
      setShameData(data);
    } catch (error) {
      console.error('Error fetching Hall of Shame data:', error);
      setError('Failed to load data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHallOfShameData(); // Fetch data on component mount
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <main>
      <div className="page-layout">
      <h2 className="shadow-text">Questionable Intelligence</h2>
      <img src="https://github.com/pauletters/Questionable-Intelligence/blob/main/public/images/icon.jpg?raw=true" alt="QI_logo" style={{ width: '150px', borderRadius: '50%' }} />
        <h1>Hall of Shame</h1>
        <p>Here are the worst of the worst:</p>
        {shameData.length > 0 ? (
          <table className="shame-table">
            <thead>
              <tr>
                <th>Username</th>
                <th>Total Violations</th>
              </tr>
            </thead>
            <tbody>
              {shameData.map((user, index) => (
                <tr key={index}>
                  <td>{user.username}</td>
                  <td>{user.totalViolations}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No data available</p>
        )}
      </div>
    </main>
  );
};

export default HallOfShame;
