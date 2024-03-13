import { Chess } from './Chess.js';

const db = require("./db-access");
const invites = new Map();
let inviteIterator = 1;

const matches = new Map();

function startMatch(player1, player2) {
  return new Chess();
}

// Temp line
matches.set(1, startMatch(1, 2));

function socketInitialize (io) {
  io.on("connection", async (socket) => {
    const userId = socket.request.session.passport.user;
    const username = await db.getUsernameById(userId);
    let currentMatchId = 1;
    let currentMatch = matches.get(currentMatchId);
    // Emit to a specific user by emitting to their room
    socket.join(`user:${userId}`);
    console.log(`user ${userId} connected`);

    // INVITE EVENTS
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
      } else if (recipientUser.id == userId) {
        socket.emit("invite", "Cannot invite self");
        return;
      }
      // Check if user is online
      const recipientSockets = await io.in(`user:${userId}`).fetchSockets();
      if (recipientSockets.length == 0) {
        socket.emit("invite", "User not online");
        return;
      }
      // Create and send invite
      console.log(`user ${userId} is inviting user ${recipientUser.id}`);

      invites.set(inviteIterator, {inviter: userId, recipient: recipientUser.id});
      io.to(`user:${recipientUser.id}`).emit("invite-ask", `User ${username} has invited you`, inviteIterator);
      inviteIterator++;
      socket.emit("invite", "Invite sent");
    });

    socket.on("invite-answer", async (answer, inviteId) => {
      // Check that invite id is valid
      if (!invites.has(inviteId)) {
        socket.emit("invite-answer", "Invalid invite id");
        return;
      }
      if (answer == "accept") {
        console.log("User accepted invite with id " + inviteId);
        // Do accept stuff
      } else { 
        console.log("User declined invite with id " + inviteId);
        // Do decline stuff
      }
    });

    // MATCH EVENTS
    socket.on("move", (move) => {
      // Validate move
      const moveRes = currentMatch.makeMove(move);

      if (moveRes) {
        io.to(`match:${currentMatchId}`).emit("move", move);
      } else {
        socket.emit("move", "Invalid move");
      }
    });

    socket.on("disconnect", () => {
      console.log("User disconnected");
    });
  });
};

module.exports = socketInitialize;
