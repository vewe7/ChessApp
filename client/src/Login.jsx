import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import Button from "react-bootstrap/Button";
import { socket } from "./socket.js";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import Form from "react-bootstrap/Form";
import Stack from "react-bootstrap/Stack";
import {
  MDBContainer,
  MDBCard,
  MDBCardBody,
  MDBCardImage,
  MDBRow,
  MDBCol
}
from "mdb-react-ui-kit";

const Login = ({ setCurUsername }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const logout = async () => {
    try { 
      const response = await fetch('http://localhost:5000/logout', {
        method: 'POST',
        credentials: 'include', // Include credentials (cookies) in the request
        headers: {
          'Content-Type': 'application/json'
        }
      })
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }   
      document.cookie = `yourAuthToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; HttpOnly`;

      setCurUsername('');

    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  useEffect(() => {
    logout();
  }, []);

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
        var warning = document.getElementById("warningLabel");
        warning.style.display = "block";

        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      // Login successful, set session cookie and redirect to home
      const data = await response.json();
      document.cookie = `yourAuthToken=${data.token}; path=/; HttpOnly`;

      // Temporarily set username to be used elsewhere
      setCurUsername(username);

      socket.connect();
      navigate("/");

    } catch (error) {
      console.error("Error during login:", error);
    }
  };

  return (
    <MDBContainer className="my-5">

      <MDBCard className="backgroundpinkColor">
        <MDBRow className="g-0 pink">

          <MDBCol md="6" style={{paddingTop:"40px"}}>
            <span className="h1 fw-bold mb-0">FAFOChess</span>
            <br />
            <span className="p fw-bold mb-0">Fun and Free Online Chess</span>
            <MDBCardImage src="FAFOLogo.svg" alt="login form" className="white w-100"/>
          </MDBCol>

          <MDBCol md="6 white">
            <MDBCardBody className="d-flex flex-column">
              <h5 className="fw-normal my-4 h2" style={{letterSpacing: "1px"}}>Sign into your account</h5>
              <Stack gap={4} className="newPadding">
                <FloatingLabel controlId="floatingInput" label="Username" className="mb-3">
                  <Form.Control type="text" placeholder="Username" onChange={(e) => setUsername(e.target.value)} />
                </FloatingLabel>
                <FloatingLabel controlId="floatingPassword" label="Password" className="mb-3">
                  <Form.Control type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)}/>
                </FloatingLabel>
                <h5 id="warningLabel" 
                  className="fw-normal my-1 h6" 
                  style={{letterSpacing: "1px", color:"red", display:"none"}}
                  >Invalid Login</h5>
              </Stack>
              <Button variant="dark" size="lg" className="porple" onClick={handleLogin} >Login</Button>

              <div className="d-flex flex-column justify-content-flex-end longPadding">
              <h3 style={{fontSize:"20px"}}>Don't have an account?</h3>
              <Link to="/register"><Button variant="outline-secondary">Create Account</Button></Link>
              </div>

            </MDBCardBody>
          </MDBCol>

        </MDBRow>
      </MDBCard>

    </MDBContainer>
  );
};

export default Login;
