import React from "react";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./App.css";
import {Alert, Button, Card, Container} from 'react-bootstrap';
//import InviteBox from "./inviteBox.jsx";

import { socket } from "./socket.js";

const Invite = () => {
    const [inviteName, setInviteName] = useState("");
    const [inviteId, setInviteId] = useState(0);
    const [show, setShow] = useState(false);
    const [username, setUsername] = useState("");

    const [allPlayers, setAllPlayers] = useState([]);

    const getAllPlayers = async () => {
        try {
          const playersResponse = await fetch(`${import.meta.env.VITE_API_URL}/player`);
          const playersData = await playersResponse.json();
    
          playersData.sort((a, b) => {
            const usernameA = a.username.toLowerCase();
            const usernameB = b.username.toLowerCase();
          
            if (usernameA < usernameB) {
              return -1;
            }
            if (usernameA > usernameB) {
              return 1;
            }
            return 0;
          });
    
          setAllPlayers(playersData);
    
        } catch (err) {
          console.error(err.message);
        }
      };

    const navigate = useNavigate();

    useEffect(() => {
        getAllPlayers();
    }, []);

    useEffect(() => {
        // socket.connect();

        socket.on("inviteAsk", (username, incomingInviteId) => {
            window.console.log(`invite from username '${username}' | invite id ${inviteId}`);
            setInviteId(incomingInviteId);
            setUsername(username);
            setShow(true);
        });
        
        socket.on("invite", (message) => {
            window.console.log(message);  
        });

        socket.on("startMatch", (matchId, color) => {
            navigate(`/game/${matchId}/${color}`);
        });

        socket.emit('joinInvite');

        return () => {
            socket.emit('leaveInvite');
            socket.off("inviteAsk");
            socket.off("invite");
            socket.off("startMatch");
        };
    }, []);
    
    function sendInvite() {
        // Send invite to socket server
        socket.emit('invite', inviteName);
    }

    function acceptInvite() {
        socket.emit("inviteAnswer", "accept", inviteId);
    }

    function declineInvite() {
        socket.emit("inviteAnswer", "decline", inviteId);
    }
    

      
    return (
        <Container className="d-flex flex-row justify-content-evenly mt-5" style={{ width:'90vw', height:'70vh'}}>
            <Card bg="light" text="dark" border="dark" style={{ width:'20%', minWidth: '260px', display:"inline-block", borderWidth: '2px' }}>
                <Card.Body style={{margin: '0px', padding: '16px 0px 16px', borderTop: '1px solid black' }}>
                    <Card.Title style={{margin: '0px'}}>List of users:</Card.Title>
                </Card.Body>
                <Card.Body style={{textAlign:'left', maxHeight: '70%', overflowY: 'auto', border: '1px solid black', borderRadius: '3px' }}>
                    {allPlayers.map(player => (
                        <p key={player.username} style={{margin: "0px"}}>{player.username}</p>
                    ))}
                </Card.Body>
            </Card>
            <Card bg="light" text="dark" border="dark" style={{ width:'65%', display:"inline-block", borderWidth: '2px' }}>
                <Card.Body style={{margin: '0px', padding: '16px 0px 16px', borderBottom: '1px solid black', borderTop: '1px solid black' }}> 
                    <Card.Title style={{margin: '0px 0px 16px'}}>Send an invite to play!</Card.Title>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0px 0px 16px'}}>
                        <input type="text" id="username" placeholder="Enter Username:" value={inviteName} onChange={(e) => setInviteName(e.target.value)} />
                        <Button variant="dark" onClick={sendInvite} style={{ marginLeft: '10px' }}>Invite</Button>
                    </div>
                    <Alert show={show} variant="secondary" style={{margin: '0px'}}>
                        <Alert.Heading>Game invite received from: {username}</Alert.Heading>
                        <div style={{display:"flex", flexDirection:"row", justifyContent:"center", gap:"10px"}}>
                            <Button onClick={() => {setShow(false); acceptInvite()}} variant="outline-dark">Accept</Button>
                            <Button onClick={() => {setShow(false); declineInvite()}} variant="outline-dark">Decline</Button>
                        </div>
                    </Alert>
                </Card.Body>
            </Card>
        </Container>
    );
}

export default Invite;