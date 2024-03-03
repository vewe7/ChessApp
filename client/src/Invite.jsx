import React from "react";
import { useState, useEffect, useRef } from "react";
import "./App.css";

import io from "socket.io-client";
const SOCKET_SERVER_URL = "http://localhost:5000";

const Invite = ({username}) => {
    const usernameRef = useRef(username);
    const [inviteName, setInviteName] = useState("");
    const [socket, connectSocket] = useState(null);

    useEffect(() => {
        // Connect to socket server
        const socket = io(SOCKET_SERVER_URL, {withCredentials: true});

        connectSocket(socket);

        socket.emit('joinInvite');

        // Cleanup on component unmount
        return () => {
            socket.emit('leaveInvite');
            socket.disconnect();
        };
    }, []); // Empty array means this effect runs only once on mount

    const sendInvite = () => {
        // Send invite to socket server
        socket.emit('invite', {from: usernameRef, to: inviteName});
    }
      
    return (
        <>
            <div className="BoxBackground">
                <h1>Login</h1>
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