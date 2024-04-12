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
        socket.removeAllListeners("inviteAsk");
        socket.removeAllListeners("invite");
        socket.removeAllListeners("startMatch");

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
        <>
        <div>
            <div className="BoxBackground">
                <h1>Invite</h1>
                <label>
                Invite User:
                <input type="text" value={inviteName} onChange={(e) => setInviteName(e.target.value)} />
                </label>
                <button onClick={sendInvite}>
                Invite
                </button>     
                <Alert show={show} variant="success">
                <Alert.Heading>New invite from</Alert.Heading>
                <h4>{username}</h4>
                <div className="d-flex justify-content-end">
                    <Button onClick={() => {setShow(false); acceptInvite()}} variant="outline-success">Accept</Button>
                </div>
                <div className="d-flex justify-content-end">
                  <Button onClick={() => {setShow(false); declineInvite()}} variant="danger">
                    Decline
                  </Button>
                </div>
              </Alert>

            </div>
        </div>
            
        </>
    );
}

export default Invite;