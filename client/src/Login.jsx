import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try { 
      // Send login request to bcakend 
      const response = await fetch('http://localhost:5000/login', {
        method: 'POST',
        credentials: 'include', // Include credentials (cookies) in the request
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      })
      // Throw error if login failed
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      // Login successful, set session cookie and redirect to home
      const data = await response.json();
      document.cookie = `yourAuthToken=${data.token}; path=/; HttpOnly`;
      navigate("/");

    } catch (error) {
      console.error('Error during login:', error);
    }
  };

  return (
    <div>
      <h1>Login</h1>
      <label>
        Username:
        <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
      </label>
      <br />
      <label>
        Password:
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      </label>
      <br />
      <button onClick={handleLogin}>Login</button>
    </div>
  );
};

export default Login;