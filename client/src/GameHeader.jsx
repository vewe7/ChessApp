import './App.css';
import React from 'react';
import {Container, Navbar, Stack} from 'react-bootstrap';

const GameHeader = () => {
    
    return (
        <Navbar className="navbar navbar-expand-md py-1 pink" style={{borderBottom:"2px solid black"}}>
            <Container fluid className="d-flex justify-content-center" style={{width:"100vw"}}>
                <Navbar.Brand>
                    <Stack direction="horizontal">
                        <img src="/FAFOLogo.svg" width="50" height="50" style={{backgroundColor: "black"}}/>
                        <Stack direction="vertical" className='justify-content-center'>
                            <h2 style={{fontSize:"24px", margin:"0px"}}>FAFOChess</h2>
                            <p style={{fontSize:"8px", margin:"-5px 0px 0px"}}>Fun and Free Online Chess</p>
                        </Stack>
                    </Stack>
                </Navbar.Brand>
            </Container>
        </Navbar>
    );
}

export default GameHeader;