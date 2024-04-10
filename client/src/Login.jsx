import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import { socket } from "./socket.js";
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';
import Stack from 'react-bootstrap/Stack';

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      // Send login request to backend
      const response = await fetch("http://localhost:5000/login", {
        method: "POST",
        credentials: "include", // Include credentials (cookies) in the request
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });
      // Throw error if login failed
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      // Login successful, set session cookie and redirect to home
      const data = await response.json();
      document.cookie = `yourAuthToken=${data.token}; path=/; HttpOnly`;

      socket.connect();
      navigate("/");

    } catch (error) {
      console.error("Error during login:", error);
    }
  };

  return (
    <div>
      <div className="LoginRegisterBoxes">
        <div className="LoginLogoBoxes pink">
          <h1>FAFOChess</h1>
          <div className="LoginLogoBoxes white">
          <img src ="FAFOLogo .svg"></img>
          </div>
        </div>
        <Stack className="BoxBackground">
          <h1>Login</h1>
          <FloatingLabel controlId="floatingInput" label="Username" className="mb-3">
            <Form.Control type="text" placeholder="Username" onChange={(e) => setUsername(e.target.value)} />
          </FloatingLabel>
          <FloatingLabel controlId="floatingPassword" label="Password" className="mb-3">
            <Form.Control type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)}/>
          </FloatingLabel>
          <Button variant="dark" size="lg" className="porple" onClick={handleLogin} >Sign In</Button>
          <Stack className="justify-content-center" direction="horizontal" gap={2} style={{width:"40vw"}}>
            <h3 style={{fontSize:"20px"}}>Don't have an account?</h3>
            <Link to="/register"><Button variant="outline-secondary">Create Account</Button></Link>
          </Stack>
        </Stack>
        
      </div>

    </div>
  );
};

export default Login;
