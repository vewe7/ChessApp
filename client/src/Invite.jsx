import React from "react";
import { useState, useEffect, useRef } from "react";
import "./App.css";

import { socket } from "./socket.js";


const Invite = () => {
    const [inviteName, setInviteName] = useState("");
    useEffect(() => {
        socket.on("invite-ask", (username, inviteId) => {
            window.console.log(`invite from username '${username}' | invite id ${inviteId}`);
        });
        
        socket.on("invite", (message) => {
            window.console.log(message);
        });

        socket.emit('joinInvite');
        return () => {
            socket.emit('leaveInvite');
            socket.off("invite-ask");
            socket.off("invite");
            socket.disconnect(); // Remember to reconnect socket on match page mount
        };
    }, []);
    
    const sendInvite = () => {
        // Send invite to socket server
        socket.emit('invite', inviteName);
    }
      
    return (
        <>
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
        </>
    );
}

export default Invite;