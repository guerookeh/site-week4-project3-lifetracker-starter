import React from 'react';
import { Link } from 'react-router-dom';
import './Nav.css';

function Nav() {
  // we need a conditional for both types of navbars
  // if authenticated, the navbar will change

  function GuestNav() {
    return (
      <>
        <li className="navbar-item">
          <Link to="/register" className="nav-link">
            Register
          </Link>
        </li>
        <li className="navbar-item">
          <Link to="/login" className="nav-link">
            Login
          </Link>
        </li>
      </>
    );
  }

  function UserNav() {
    return (
      <li className="navbar-item">
        <Link to="/" className="nav-link">
          Logout
        </Link>
      </li>
    );
  }

  return (
    <div className="navbar">
      <ul className="navbar-list">
        <li className="navbar-item">
          <Link to="/" className="nav-link">
            Home
          </Link>
        </li>
        { false ? <UserNav /> : <GuestNav /> }
      </ul>
    </div>
  );
}

export default Nav;
