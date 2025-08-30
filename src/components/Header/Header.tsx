import React from 'react';
import { NavLink } from 'react-router-dom';
import './Header.css';

const Header: React.FC = () => {
  return (
    <header className="header">
      <div className="header__container">
        <h1 className="header__title">🏁 Async Race</h1>
        <nav className="header__nav">
          <NavLink 
            to="/garage" 
            className={({ isActive }) => 
              `header__nav-link ${isActive ? 'header__nav-link--active' : ''}`
            }
          >
            Garage
          </NavLink>
          <NavLink 
            to="/winners" 
            className={({ isActive }) => 
              `header__nav-link ${isActive ? 'header__nav-link--active' : ''}`
            }
          >
            Winners
          </NavLink>
        </nav>
      </div>
    </header>
  );
};

export default Header;