// RegisterForm.js
import React, { useState } from 'react';
import axios from 'axios';

function RegisterForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");

  const register = (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append('username', username);
    formData.append('password', password);
    formData.append('email', email);
  
    axios.post('http://localhost:4003/register', formData)
      .then((response) => {
        console.log(response.data);
        // You can add any actions you want to perform after successful registration here
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <div>
      <h1>Register</h1>
      <input placeholder="username" onChange={(e) => setUsername(e.target.value)} />
      <input placeholder="password" type="password" onChange={(e) => setPassword(e.target.value)} />
      <input placeholder="email" onChange={(e) => setEmail(e.target.value)} />
      <button onClick={register}>Submit</button>
    </div>
  );
}

export default RegisterForm;