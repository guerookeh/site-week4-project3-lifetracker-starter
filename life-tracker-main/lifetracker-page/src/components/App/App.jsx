import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import LandingPage from "./components/LandingPage";
import RegistrationPage from "./components/RegistrationPage";
import LoginPage from "./components/LoginPage";
import DetailedActivityPage from "./components/DetailedActivityPage";
import NavBar from "./components/NavBar";

export default function App() {
  
  const [user, setUser] = useState(null);

  /*
  useEffect(() => {

  }. []);
  */
  
  return (
    <Router>
      <NavBar />
      <Switch>
        <Route path="/" exact component={LandingPage} />
      </Switch>
    </Router>   
  );
}
