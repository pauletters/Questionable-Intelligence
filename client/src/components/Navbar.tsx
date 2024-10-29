import React, { useState } from 'react';
import { useNavigate, NavLink, useLocation } from 'react-router-dom';
import auth from '../utils/auth';

const Nav: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  
  const handleLogout = () => {
    auth.logout();
    navigate('/', { replace: true });
    setIsOpen(false);
  }

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  }

  if (!auth.loggedIn() || location.pathname === '/') {
    return null;
  }

  return (
    <nav className="nav">
      <button 
        className={`hamburger ${isOpen ? 'active' : ''}`} 
        onClick={toggleMenu}
        aria-label="menu"
      >
        <span className="line"></span>
        <span className="line"></span>
        <span className="line"></span>
      </button>

      <ul className={`nav-menu ${isOpen ? 'active' : ''}`}>
        <li className="nav-item">
          <NavLink
            to="/Form"
            className={({ isActive }) => 
              `nav-link ${isActive ? 'active' : ''}`
            }
            onClick={() => setIsOpen(false)}
          >
            Home
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink 
            to="/LeaderBoard"
            className={({ isActive }) => 
              `nav-link ${isActive ? 'active' : ''}`
            }
            onClick={() => setIsOpen(false)}
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
            onClick={() => setIsOpen(false)}
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
            onClick={() => setIsOpen(false)}
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