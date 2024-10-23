import React from 'react';
import { useNavigate } from 'react-router-dom';
import { NavLink } from 'react-router-dom';
import auth from '../utils/auth';


const handleLogout = () => {
  auth.logout();
  const navigate = useNavigate();
  navigate('/', { replace: true }); // Redirect to home page after logout
}


const Nav: React.FC = () => {
  return (
    <nav className="nav">
      <ul style={{ display: 'flex', padding: 0, margin: 0 }}>
        <li className="nav-item">
          <NavLink 
            to="/"
            className={({ isActive }) => 
              `nav-link ${isActive ? 'active' : ''}`
            }
          >
            Home
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink 
            to="/QuestionPage"
            className={({ isActive }) => 
              `nav-link ${isActive ? 'active' : ''}`
            }
          >
            Questions
          </NavLink>
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
            <button type='button' onClick={handleLogout}>
              Logout
            </button>
          </li>
      </ul>
    </nav>
  );
};

export default Nav;
