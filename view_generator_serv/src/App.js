import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route
} from "react-router-dom";
import Home from './components/Home';
import Dashboard from './components/Dashboard';

function App() {

  return (
    <>
    <Router>
      <Routes>
        <Route exact path = "/" element={<Home/>}/>
        <Route exact path="/dashboard" element={<Dashboard/>}/>
      </Routes>
    </Router>
    </>
  );
}

export default App;
