import React from 'react';
import { NavLink } from 'react-router-dom';

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
      </ul>
    </nav>
  );
};

export default Nav;
