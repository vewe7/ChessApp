import React from "react";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./App.css";
import {Alert} from 'react-bootstrap';
import {Button} from "react-bootstrap";
//import InviteBox from "./inviteBox.jsx";

import { socket } from "./socket.js";

const Invite = () => {
    const [inviteName, setInviteName] = useState("");
    const [inviteId, setInviteId] = useState(0);
    const [show, setShow] = useState(false);
    const [username, setUsername] = useState("");


    const navigate = useNavigate();

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
        <div style={{position:"relative", display:"flex", justifyContent:"center", alignItems:"center", width:"100vw", height:"100vh"}}>
            <div className="BoxBackground">
                <h2 style={{marginBottom:"0px"}}>Send an invite to play!</h2>
                <div >
                    <label htmlFor="username">Enter Username:</label>
                    <input type="text" id="username" value={inviteName} onChange={(e) => setInviteName(e.target.value)} />
                </div>
                <Button variant="dark" onClick={sendInvite}>Invite</Button>
                <Alert show={show} variant="secondary">
                    <Alert.Heading>Game invite received from: {username}</Alert.Heading>
                    <div style={{display:"flex", flexDirection:"row", justifyContent:"center", gap:"10px"}}>
                        <Button onClick={() => {setShow(false); acceptInvite()}} variant="outline-dark">Accept</Button>
                        <Button onClick={() => {setShow(false); declineInvite()}} variant="outline-dark">Decline</Button>
                    </div>
                </Alert>
            </div>
        </div>
    );
}

export default Invite;