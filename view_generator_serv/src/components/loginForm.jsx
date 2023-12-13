// LoginForm.js
import React, { useState,useContext,useEffect } from 'react';
import axios from 'axios';
import UserContext from './usercontext';

function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { username: contextUsername, id: contextId ,setUserData } = useContext(UserContext);

  useEffect(() => {
    console.log(`Context Username: ${contextUsername}, Context ID: ${contextId}`);
  }, [contextUsername, contextId]);


  const login = (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append('username', username);
    formData.append('password', password);
  
    axios.post('http://localhost:4003/login', formData)
      .then((response) => {
        console.log(response.data);
        setUserData({ username: response.data.username, id: response.data._id })
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <div>
      <h1>Login</h1>
      <input placeholder="username" onChange={(e) => setUsername(e.target.value)} />
      <input placeholder="password" type="password" onChange={(e) => setPassword(e.target.value)} />
      <button onClick={login}>Submit</button>
    </div>
  );
}

export default LoginForm;