// LoginForm.js
import React, { useState } from 'react';
import axios from 'axios';

function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const login = (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append('username', username);
    formData.append('password', password);
  
    axios.post('http://localhost:4003/login', formData)
      .then((response) => {
        console.log(response.data);
        // You can add any actions you want to perform after successful login here
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