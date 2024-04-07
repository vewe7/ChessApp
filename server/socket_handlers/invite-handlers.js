const db = require("../db-access");
const { matches, matchIterator } = require("./match-handlers");

const pendingInvites = new Map();
let inviteIterator = 1;

function startMatch(whiteUsername, blackUsername) {
    const chess = new Chess();
    chess.header("White", whiteUsername, "Black", blackUsername);

    const date = new Date();
    chess.header("Date", `${date.getMonth()}-${date.getDate()}-${date.getFullYear()}`);

    return chess;
}

module.exports = (io, socket, socketUser) => {
    // INVITE EVENTS ================
    socket.on("joinInvite", () => {
        socket.join("inviteRoom");
    });

    socket.on("leaveInvite", () => {
        socket.leave("inviteRoom");
    });

    socket.on("invite", async (to) => {
        // Validate username
        const recipientUser = await db.getUserByUsername(to);
        if (recipientUser == null) {
            socket.emit("invite", "User not found");
            return;
        } else if (recipientUser.id == socketUser.id) {
            socket.emit("invite", "Cannot invite self");
            return;
        }
        // Check if user is online
        const recipientSockets = await io.in(`user:${recipientUser.id}`).fetchSockets();
        if (recipientSockets.length == 0) {
            socket.emit("invite", "User not online");
            return;
        }
        // Create and send invite
        console.log(`user ${socketUser.id} is inviting user ${recipientUser.id}`); // DEBUG

        pendingInvites.set(inviteIterator, {inviter: socketUser, recipientUser});
        io.to(`user:${recipientUser.id}`).emit("inviteAsk", 
                                            socketUser.username, 
                                            inviteIterator++);
        socket.emit("invite", "Invite sent");
    });

    socket.on("inviteAnswer", async (answer, inviteId) => {
        // Check that invite id is valid
        if (!pendingInvites.has(inviteId)) {
            socket.emit("inviteAnswer", "Invalid invite id");
            return;
        }

        if (answer == "accept") { // Accept invite
            const invite = pendingInvites.get(inviteId);
            const players = [invite.inviter, invite.recipient];
            shuffle(players); // Randomize white/black player

            // Maps match id to new Chess object 
            matches.set(matchIterator, startMatch(players[0].username, players[1].username));

            io.to(`user:${colorIds[0]}`).emit("startMatch", matchIterator, "white");
            io.to(`user:${colorIds[1]}`).emit("startMatch", matchIterator, "black");
            matchIterator++;
            // Clean up 
            pendingInvites.delete(inviteId);
        } else { // Decline invite
            io.to(`user:${pendingInvites.get(inviteId).inviter}`).emit("inviteAnswer", "User declined invite");
            pendingInvites.delete(inviteId);
        }
    });
};