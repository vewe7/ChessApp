import React from "react";
import { useState, useEffect, useRef } from "react";
import "./App.css";

const Invite = ({socket}) => {
    const [inviteName, setInviteName] = useState("");
    useEffect(() => {
        socket.emit('joinInvite');
        return () => {
            socket.emit('leaveInvite');
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