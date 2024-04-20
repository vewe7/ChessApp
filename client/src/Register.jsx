import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./App.css";
import { Link } from "react-router-dom";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Stack from "react-bootstrap/Stack";
import {
  MDBBtn,
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardBody,
  MDBInput,
  MDBIcon
}
from "mdb-react-ui-kit";

function Register({ setCurUsername, setSearchedUsername }) {
  const navigate = useNavigate();
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("Passwords do not match");

  const logout = async () => {
    try { 
      const response = await fetch(`${import.meta.env.VITE_API_URL}/logout`, {
        method: "POST",
        credentials: "include", // Include credentials (cookies) in the request
        headers: {
          "Content-Type": "application/json"
        }
      })
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }   
      document.cookie = `yourAuthToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; HttpOnly`;

      setCurUsername("");
      setSearchedUsername("");

    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  useEffect(() => {
    logout();
  }, []);

  const [formData, setFormData] = useState({
    username: "",
    password: "",
    confirmPassword: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formData.password !== formData.confirmPassword)
        throw new Error("Passwords do not match");

      const body = {
        username: formData.username,
        password: formData.password
      };

      const response = await fetch(`${import.meta.env.VITE_API_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.error);
      }

      navigate("/login");
    } catch (error) {
      setErrorMessage(error.message);
      setShowError(true);
    }
  };

  return (
    <MDBContainer fluid>

      <MDBRow className="d-flex justify-content-center align-items-center h-100">
        <MDBCol col="12">

          <MDBCard className="my-5 mx-auto white" style={{maxWidth: "500px", color:"black"}}>
            <MDBCardBody className="p-5 d-flex flex-column align-items-center mx-auto w-100">

              <h2 className="fw-bold mb-2 text-uppercase" style={{paddingBottom:"20px"}}>Create Account</h2>
              
              <Stack gap={4} className="newPadding">
                <FloatingLabel controlId="floatingInput" label="Username" className="mb-3">
                  <Form.Control type="text" name="username" value={formData.username} onChange={handleChange}/>
                </FloatingLabel>
                <FloatingLabel controlId="floatingPassword" label="Password" className="mb-3">
                  <Form.Control type="password" name="password" value={formData.password} onChange={handleChange}/>
                </FloatingLabel>
                <FloatingLabel controlId="floatingConfirmPassword" label="Confirm Password" className="mb-3">
                  <Form.Control type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange}/>
                </FloatingLabel>
                { showError ? 
                <h5 id="notMatching" 
                  className="fw-normal my-1 h6" 
                  style={{letterSpacing: "1px", color:"red", display:"block"}}
                  >{errorMessage}</h5> : null }
              </Stack>
              
              <Button variant="dark" size="lg" className="porple" onClick={handleSubmit}>Create Account</Button>{" "}


              <Stack className="topPadding" direction="horizontal" gap={5}>
                <h3 style={{fontSize:"15px"}}>Already have an account?</h3>
                <Link to="/login"><Button size="sm" variant="outline-secondary">Sign In</Button></Link>
              </Stack>
            </MDBCardBody>
          </MDBCard>

        </MDBCol>
      </MDBRow>

    </MDBContainer>
  );

}

export default Register;