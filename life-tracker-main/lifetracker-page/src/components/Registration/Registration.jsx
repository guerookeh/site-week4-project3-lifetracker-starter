import React from "react";
import "./Registration.css";

function Registration() {

  function handleSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const formValues = [];
    for (const [name, value] of formData.entries()) {
      formValues.push({ name, value });
    }
    // postRegistrationRequest(formValues);
  }

  async function postRegistrationRequest(formData) {
    // iterate through all values in the object and extract
    // send json to the backend server to the POST /register endpoint
    // await for a response to see if the request was successful or if request error
    // place a loading or something below and notify the user when account successfully created
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
          <input name="firstName" type="text" placeholder="First Name" />
        </div>
        <div className="form-group">
          <input name="lastName" type="text" placeholder="Last Name" />
        </div>
        <button type="submit">Register</button>
      </form>
    </div>
  );
}

export default Registration;
