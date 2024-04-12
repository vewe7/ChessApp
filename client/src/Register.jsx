import React, { useState } from "react";
import "./App.css";
import { Link } from 'react-router-dom';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from "react-bootstrap/Form";
import Button from 'react-bootstrap/Button';
import Stack from 'react-bootstrap/Stack';
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
from 'mdb-react-ui-kit';

function Register() {
  return (
    <MDBContainer fluid>

      <MDBRow className='d-flex justify-content-center align-items-center h-100'>
        <MDBCol col='12'>

          <MDBCard className='my-5 mx-auto white' style={{maxWidth: '500px', color:"black"}}>
            <MDBCardBody className='p-5 d-flex flex-column align-items-center mx-auto w-100'>

              <h2 className="fw-bold mb-2 text-uppercase" style={{paddingBottom:"20px"}}>Create Account</h2>

              <Stack gap={4} className="newPadding">
                <FloatingLabel controlId="floatingInput" label="Username" className="mb-3">
                  <Form.Control type="text" placeholder="Username" />
                </FloatingLabel>
                <FloatingLabel controlId="floatingPassword" label="Password" className="mb-3">
                  <Form.Control type="password" placeholder="Password"/>
                </FloatingLabel>
                <FloatingLabel controlId="floatingPassword" label="Confirm Password" className="mb-3">
                  <Form.Control type="password" placeholder="Password"/>
                </FloatingLabel>
              </Stack>


              <p className="small mb-3 pb-lg-2"><a class="text-white-50" href="#!">Forgot password?</a></p>
              <Button variant="dark" size="lg" className="porple">Create Account</Button>{' '}


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