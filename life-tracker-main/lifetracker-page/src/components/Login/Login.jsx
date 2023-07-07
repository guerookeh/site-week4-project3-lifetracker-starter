import React from 'react';
import './Login.css';

function Login() {

  function handleSubmit() {
    // Handle form submission logic
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
    </div>
  );
}

export default Login;
