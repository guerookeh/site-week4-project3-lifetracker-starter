import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import './Nav.css';

import { AuthenticatedUserContext } from '../App/App.jsx';

import LifeTrackerAPIClient from '../../api/apiclient.js';

function Nav() {

  const { authenticatedUserState, setAuthenticatedUserState } = useContext(AuthenticatedUserContext);

  async function handleLogout() {
    setAuthenticatedUserState(null);
    const apiClient = new LifeTrackerAPIClient();
    const apiRoute = '/auth/logout';
    const response = await apiClient.get(apiRoute, {}, {});;
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
      <>
        <li className="navbar-item">
          <Link to="/" className="nav-link" onClick={handleLogout}>
            Logout
          </Link>
        </li>
        <li className="navbar-item">
          <Link to="/nutrition" className="nav-link" onClick={handleLogout}>
            Nutrition
          </Link>
        </li>
      </>
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
