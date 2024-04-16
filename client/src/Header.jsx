import './App.css';
import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { MDBCardImage } from 'mdb-react-ui-kit';
import Stack from 'react-bootstrap/Stack';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Collapse from 'react-bootstrap/Collapse';

function toggleSearch() {
    var searchBar = document.getElementById("searchBar");
    var displaySetting = searchBar.style.display;

    if (displaySetting == "block")
    {
        searchBar.style.display = "none";
    }
    else
    {
        searchBar.style.display = "block";
    }
}

function activateHome() {
    var navBar = document.getElementById("NavigationBar")
    navBar.active = document.getElementById("home");
    navBar.disabled = document.getElementById("profile");
}

function activateProfile() {
    var navBar = document.getElementById("NavigationBar")
    navBar.active = document.getElementById("profile");
    navBar.disabled = document.getElementById("home");
}

function setHBold() {
    var boldItem = document.getElementById("H");
    var normItem = document.getElementById("P");

    boldItem.style.fontWeight = "bold";
    normItem.style.fontWeight = "normal";
}

function setPBold() {
    var boldItem = document.getElementById("P");
    var normItem = document.getElementById("H");

    boldItem.style.fontWeight = "bold";
    normItem.style.fontWeight = "normal";
}

const Header = ({ curUsername, setSearchedUsername }) => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState('');

    const handleChange = (e) => {
        setFormData(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`http://localhost:5000/player/username/${formData}`);
            const responseData = await response.json();

            if (!response.ok) {
                throw new Error(responseData.error);
            }

            setSearchedUsername(formData);
            navigate("../searched-profile");
            window.location.reload();
        } catch (err) {
            console.error(err.message);
        }
    };
    
    return (
        <Navbar className="navbar navbar-expand-md py-1 pink">
        <Container style={{width:"100vw", paddingLeft:"0px"}}>
            <Navbar.Brand href="/home">
                <Stack direction="horizontal">
                    <h2>FAFOChess</h2>
                </Stack>
            </Navbar.Brand>

            <Nav variant="underline" id="NavigationBar">
                <Nav.Item>
                    <Nav.Link id="H" href="/home" onSelect={setHBold}>Home</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link id="P" href="/profile" onSelect={setPBold}>Profile</Nav.Link>
                </Nav.Item>  
            </Nav>

          <Navbar.Collapse className="justify-content-end">
          <Form inline onSubmit={handleSubmit}>
                <Row>
                    <Col xs="auto">
                        <Button className="porple" 
                        variant="secondary"
                        onClick={toggleSearch}
                        >
                            <img src="search.svg"></img>
                        </Button>
                    </Col>
                    <Col xs="auto">
                        <Form.Control
                            type="text"
                            placeholder="Search for User"
                            className=" mr-sm-2"
                            id="searchBar"
                            style={{background:"none", display:"none"}}
                            value={formData}
                            onChange={handleChange} 
                        />
                    </Col>
                </Row>
            </Form>
            <div style={{width:"10px"}} />
          <Navbar.Text>
            Signed in as: <a href="/profile">{curUsername}</a>
          </Navbar.Text>
        </Navbar.Collapse>
        </Container>
      </Navbar>
    );
    
}

export default Header