import React from 'react';
import Login from './components/loginForm';
import Signup from './components/signUpForm';
import Dashboard from './pages/Dashboard';
import { useAuthContext } from "./hooks/useAuthContext";
import { useLogout } from "./hooks/useLogout";


function App() {
  
  const { user } = useAuthContext();
  const { logout } = useLogout();

  

  const handleClick = async () => {
    await logout();
  };

  return (

    <div className="App">
      {!user && <Login />}
      {!user && <Signup />}
      {user && <h1>Welcome {user.username}</h1>}
      {user && (
        <div>
          <span>{user.email}</span>
          <button onClick={handleClick}>Logout</button>
        </div>
      )}
      {user && <Dashboard />}
    </div>

  );
}

export default App;
