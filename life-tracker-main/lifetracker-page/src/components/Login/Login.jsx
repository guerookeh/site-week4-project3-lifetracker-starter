import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

import { AuthenticatedUserContext } from '../App/App.jsx';

import LifeTrackerAPIClient from '../../api/apiclient.js';

function Login() {

  const { authenticatedUserState, setAuthenticatedUserState } = useContext(AuthenticatedUserContext);

  const [loginStatus, setLoginStatus] = useState(null);
  const navigate = useNavigate();

  function processFormData(formData) {
    const formValues = Object.fromEntries(formData.entries());
    const wrappedFormValues = { credentials: formValues };
    return wrappedFormValues;
  }

  async function postLogin(wrappedFormValues) {
    const apiClient = new LifeTrackerAPIClient();
    const apiRoute = '/auth/login'; 
    const response = await apiClient.post(apiRoute, wrappedFormValues, {});
    return response
  }

  function handleLoginStatus(response) {
    if (response.ok) {
      const successString = JSON.stringify(response.body.message);
      setLoginStatus(successString);
    }
    else {
      const errorString = JSON.stringify(response.body.error.message);
      setLoginStatus(errorString);
    }
  }

  function handleAuthenticatedState(response) {
    if (response.ok) {
      const userEmail = response.body.user.email;
      setAuthenticatedUserState(userEmail);
      navigate('/'); 
    }
  }

  async function handleSubmit() {
    event.preventDefault();
    const formData = new FormData(event.target);
    const wrappedFormObj = processFormData(formData);
    const response = await postLogin(wrappedFormObj);
    handleLoginStatus(response);
    handleAuthenticatedState(response);
  }

  return (
    <div className="login">
      <h2>Login</h2>
      <form className="login-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <input name="email" type="email" placeholder="Email" />
        </div>
        <div className="form-group">
          <input name="password" type="password" placeholder="Password" />
        </div>
        <button type="submit">Log in</button>
      </form>
      { (loginStatus) ? <h3>{loginStatus}</h3> : <></> }
    </div>
  );
}

export default Login;
