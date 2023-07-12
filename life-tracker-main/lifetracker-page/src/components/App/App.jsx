import React, { useState, useEffect, createContext } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Home from '../Home/Home.jsx';
import Nav from '../Nav/Nav.jsx';
import Registration from '../Registration/Registration.jsx';
import Login from '../Login/Login.jsx';
import Nutrition from '../Nutrition/Nutrition.jsx';

import LifeTrackerAPIClient from '../../api/apiclient.js';

export const AuthenticatedUserContext = createContext(null);

function App() {

  const [authenticatedUserState, setAuthenticatedUserState] = useState(null);

  useEffect(() => {
    async function cookieLogin() {
      const apiClient = new LifeTrackerAPIClient();
      const apiRoute = '/auth/cookieLogin';
      const response = await apiClient.post(apiRoute);
      if (response.ok) {
        const userObj = response.body.userObj;
        setAuthenticatedUserState(userObj);
      }
    }
    cookieLogin();
  }, []);

  return (
    <Router>
      <AuthenticatedUserContext.Provider value={{ authenticatedUserState, setAuthenticatedUserState }}>
        <Nav />
        <Routes>
          <Route path='/' element={<Home />} /> 
          {
            (authenticatedUserState) ? (
              <>
                <Route path='/nutrition' element={<Nutrition />} />
              </>
            ) : (
              <>
                <Route path='/register' element={<Registration />} />
                <Route path='/login' element={<Login />} />
              </>
            )  
          }
        </Routes>
      </AuthenticatedUserContext.Provider>
    </Router>
  );
}

export default App;
