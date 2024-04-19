import './App.css';
import React, { useEffect, useState } from 'react';
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
import Logout from './Logout';
import { NavbarCollapse } from 'react-bootstrap';

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

const Header = ({ curUsername, setCurUsername, searchedUsername, setSearchedUsername }) => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState('');

    const handleChange = (e) => {
        setFormData(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/player/username/${formData}`);
            const responseData = await response.json();

            if (!response.ok) {
                throw new Error(responseData.error);
            }

            setSearchedUsername(formData);
            navigate(`/profile/${formData}`);
        } catch (err) {
            console.error(err.message);
        }
    };
    
    return (
        <Navbar className="navbar navbar-expand-md py-1 pink" style={{borderBottom:"2px solid black"}}>
            <Container fluid style={{width:"100vw"}}>
                <Navbar.Brand onClick={() => navigate("/")} style={{cursor:"pointer"}}>
                    <Stack direction="horizontal">
                        <img src="/FAFOLogo.svg" width="50" height="50" style={{backgroundColor: "black"}}/>
                        <Stack direction="vertical" className='justify-content-center'>
                            <h2 style={{fontSize:"24px", margin:"0px"}}>FAFOChess</h2>
                            <p style={{fontSize:"8px", margin:"-5px 0px 0px"}}>Fun and Free Online Chess</p>
                        </Stack>
                    </Stack>
                </Navbar.Brand>

                <Nav variant="underline" id="NavigationBar">
                    <Nav.Item>
                        <Nav.Link id="H" onClick={() => navigate("/")} style={{cursor:"pointer"}} onSelect={setHBold}>Home</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link id="P" onClick={() => {setSearchedUsername(searchedUsername ? '' : curUsername); navigate(`/profile/${curUsername}`);}} style={{cursor:"pointer"}} onSelect={setPBold}>Profile</Nav.Link>
                    </Nav.Item>  
                </Nav>

                <NavbarCollapse className="justify-content-start" style={{margin: "0px 16px 0px 16px"}}>
                    <Form inline="true" onSubmit={handleSubmit}>
                        <Row>
                            <Col xs="auto">
                                <Button className="porple" 
                                variant=""
                                onClick={toggleSearch}
                                >
                                    <img src="/search.svg"></img>
                                </Button>
                            </Col>
                            <Col xs="auto">
                                <Form.Control
                                    type="text"
                                    placeholder="Search for User"
                                    className=" mr-sm-2"
                                    id="searchBar"
                                    style={{maxWidth: "137px", background:"none", display:"none"}}
                                    value={formData}
                                    onChange={handleChange} 
                                />
                            </Col>
                        </Row>
                    </Form>
                </NavbarCollapse>

                <Navbar.Collapse className="justify-content-end">    
                    <Navbar.Text>
                        Signed in as: <p onClick={() => {setSearchedUsername(searchedUsername ? '' : curUsername); navigate(`/profile/${curUsername}`);}} style={{display:"inline", fontWeight:"600", cursor:"pointer"}}>{curUsername}</p>
                    </Navbar.Text>
                    <div style={{margin:"0px 16px 0px 16px"}}>
                        <Logout setCurUsername={setCurUsername} setSearchedUsername={setSearchedUsername}/>
                    </div>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default Header