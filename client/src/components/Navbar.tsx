import React from 'react';
import { useNavigate, NavLink, useLocation } from 'react-router-dom';
import auth from '../utils/auth';


const Nav: React.FC = () => {

  const navigate = useNavigate();
  const location = useLocation();
  
  const handleLogout = () => {
    auth.logout();
    navigate('/', { replace: true }); // Redirect to home page after logout
  }
  
  const handleHomeClick = () => {
    if (auth.loggedIn()) { // Check if the user is logged in
      navigate('/Form'); // Redirect to the form page
    } else {
      navigate('/'); // Redirect to the login page
    }
  };

  if (!auth.loggedIn() || location.pathname === '/') {
    return null; // Do not render the nav bar if the user is not logged in
  }

  return (
    <nav className="nav">
      <ul>
        <li className="nav-item">
          <button className="nav-button"
            onClick={handleHomeClick} // Use button for home link
          >
            Home
          </button>
        </li>
        <li className="nav-item">
          <NavLink 
            to="/LeaderBoard"
            className={({ isActive }) => 
              `nav-link ${isActive ? 'active' : ''}`
            }
          >
            Leaderboard
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink 
            to="/HallOfShame"
            className={({ isActive }) => 
              `nav-link ${isActive ? 'active' : ''}`
            }
          >
            Hall of Shame
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink 
            to="/UserAccount"
            className={({ isActive }) => 
              `nav-link ${isActive ? 'active' : ''}`
            }
          >
            User Account
          </NavLink>
        </li>
        <li className='nav-item'>
            <button className="nav-button" onClick={handleLogout}>
              Logout
            </button>
          </li>
      </ul>
    </nav>
  );
};

export default Nav;
