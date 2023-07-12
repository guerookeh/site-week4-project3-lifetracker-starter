;import React, { useState } from 'react';
import './Registration.css';

import LifeTrackerAPIClient from '../../api/apiclient.js';

function Registration() {

  const [registerStatus, setRegisterStatus] = useState(null); 

  function processFormData(formData) {
    const formValues = Object.fromEntries(formData.entries());
    const wrappedFormValues = { credentials: formValues };
    return wrappedFormValues;
  }

  async function postRegister(wrappedFormValues) {
    const apiClient = new LifeTrackerAPIClient();
    const apiRoute = '/auth/register';
    const response = await apiClient.post(apiRoute, wrappedFormValues, {});
    handleRegisterStatus(response);
  }

  function handleRegisterStatus(response) {
    if (response.ok) {
      const successString = JSON.stringify(response.body.message);
      setRegisterStatus(successString);
    }
    else {
      const errorString = JSON.stringify(response.body.error.message);
      setRegisterStatus(errorString);
    }
  }
 
  async function handleSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const wrappedFormObj = processFormData(formData); 
    await postRegister(wrappedFormObj);
  }

  return (
    <div className="registration">
      <h2>Register</h2>
      <form className="registration-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <input name="email" type="email" placeholder="Email" />
        </div>
        <div className="form-group">
          <input name="password" type="password" placeholder="Password" />
        </div>
        <div className="form-group">
          <input name="first_name" type="text" placeholder="First Name" />
        </div>
        <div className="form-group">
          <input name="last_name" type="text" placeholder="Last Name" />
        </div>
        <button type="submit">Register</button>
      </form>
      { (registerStatus) ? <h3>{registerStatus}</h3> : <></> }
    </div>
  );
}

export default Registration;
