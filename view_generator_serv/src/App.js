import React from 'react';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
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
        <Route exact path = "/dashboard" element={<Dashboard/>}/>
      </Routes>
    </Router>
    </>
  );
}

export default App;
