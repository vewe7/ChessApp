import React from "react";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./App.css";

import { socket } from "./socket.js";


const Invite = () => {
    const [inviteName, setInviteName] = useState("");
    const [inviteId, setInviteId] = useState(0);
    const [invitesOpen, setInvitesOpen] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        socket.removeAllListeners("inviteAsk");
        socket.removeAllListeners("invite");
        socket.removeAllListeners("startMatch");

        socket.on("inviteAsk", (username, incomingInviteId) => {
            // window.console.log(`invite from username '${username}' | invite id ${inviteId}`);
            setInviteId(incomingInviteId);
        });
        
        socket.on("invite", (message) => {
            window.console.log(message);
        });

        socket.on("startMatch", (matchId, color) => {
            window.console.log(`Match started with id ${matchId} as ${color}`);
            socket.emit("joinMatchRoom", matchId);
            navigate(`/game/${matchId}`);
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

    //(BUG)Currently Both of the buttons that use these cause the page to refresh
    function openInvites() {
        document.getElementById("invites").style.display="block";
    }
    function closeInvites() {
        document.getElementById("invites").style.display="none";
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
                
            </div>
            <button className="viewInvites" onClick={openInvites}>View Invites</button>
            <div className="invites" id="invites">
                <form  className="inviteContainer">
                   <h1>Invites</h1> 
                   <button className="accept" onClick={acceptInvite}>Accept</button>
                   <button className="decline" onClick={closeInvites}>Decline</button>
                </form>
            </div>
        </div>
            
        </>
    );
}

export default Invite;