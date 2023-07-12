import React, { useContext } from 'react';
import './Home.css';

import { AuthenticatedUserContext } from '../App/App.jsx';

function Home() {
  
  const { authenticatedUserState, setAuthenticatedUserState } = useContext(AuthenticatedUserContext);

  function GuestHome() {
    return (
      <>
        <h1 className="home__title">Welcome to LifeTracker</h1>
        <p className="home__intro">Your personal space to track and improve the activities in your life. Sign up now to start tracking!</p>
      </>
    );
  }

  function UserHome() {
    return (
      <>
        <h1 className="home__title">Welcome back to LifeTracker, {authenticatedUserState.first_name} !</h1>
      </>  
    );
  }

  return (
    <div className="home">
      { (authenticatedUserState) ? <UserHome /> : <GuestHome /> }
    </div>
  );
}

export default Home;
