import React from "react";
import { useState, useEffect, useRef } from "react";
import "./App.css";

import { socket } from "./socket.js";


const Invite = () => {
    const [inviteName, setInviteName] = useState("");
    const [invitesOpen, setInvitesOpen] = useState(false);

    useEffect(() => {
        socket.on("inviteAsk", (username, inviteId) => {
            window.console.log(`invite from username '${username}' | invite id ${inviteId}`);
        });
        
        socket.on("invite", (message) => {
            window.console.log(message);
        });

        socket.emit('joinInvite');
        return () => {
            socket.emit('leaveInvite');
            socket.off("inviteAsk");
            socket.off("invite");
            socket.disconnect(); // Remember to reconnect socket on match page mount
        };
    }, []);
    
    const sendInvite = () => {
        // Send invite to socket server
        socket.emit('invite', inviteName);
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
                   <button className="accept">Accept</button>
                   <button className="decline" onClick={closeInvites}>Decline</button>
                </form>
            </div>
        </div>
            
        </>
    );
}

export default Invite;