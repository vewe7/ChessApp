import io from "socket.io-client";
const SOCKET_SERVER_URL = "http://localhost:5000";

export const socketInitialize = () => {
    const socket = io(SOCKET_SERVER_URL, {withCredentials: true, autoConnect: false});

    socket.on("invite-ask", (message, inviteId) => {
        window.console.log(message);
        window.console.log(`invite id is ${inviteId}`);
    });

    return socket;
};

export const socketDismount = (socket) => {
    // Disconnect from socket server
    socket.disconnect();
}