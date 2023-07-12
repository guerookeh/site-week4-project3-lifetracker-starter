import React, { useState, useEffect, createContext } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Home from '../Home/Home.jsx';
import Nav from '../Nav/Nav.jsx';
import Registration from '../Registration/Registration.jsx';
import Login from '../Login/Login.jsx';
// import Nutrition from '../Nutrition/Nutrition.jsx';

export const AuthenticatedUserContext = createContext(null);

function App() {
  const [authenticatedUserState, setAuthenticatedUserState] = useState(null);

  useEffect(() => {
    
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
                <Route path='/register' element={<Registration />} />
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
