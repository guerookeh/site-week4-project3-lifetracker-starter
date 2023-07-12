import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import './Nav.css';

import { AuthenticatedUserContext } from '../App/App.jsx';

function Nav() {

  const { authenticatedUserState, setAuthenticatedUserState } = useContext(AuthenticatedUserContext);

  function handleLogout() {
    setAuthenticatedState(null);
  }

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
        <Link to="/" className="nav-link" onClick={handleLogout}>
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
        { (authenticatedUserState) ? <UserNav /> : <GuestNav /> }
      </ul>
    </div>
  );
}

export default Nav;
