import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "../Home/Home.jsx";
import Nav from "../Nav/Nav.jsx";


function App() {
  
  const [user, setUser] = useState(null);
  
  return (
    <>
      <Router>
        <Nav />
        <Routes>
          <Route path ="/" element={<Home />} />
          <Route path="/register" element={<h3>register</h3>} />
          <Route path="/login" element={<h3>login</h3>} />
        </Routes>
      </Router>
    </>
  );

}

export default App;
