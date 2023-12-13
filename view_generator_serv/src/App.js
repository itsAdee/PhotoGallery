import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Login from './components/Login';
import {
  BrowserRouter as Router,
  Routes,
  Route
} from "react-router-dom";

function App() {

  return (
    <>
    <Router>
      <Routes>
        <Route exact path = "/" element={<Login/>}/>
      </Routes>
    </Router>
    </>
  );
}

export default App;
