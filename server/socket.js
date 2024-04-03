const Chess = require("./Chess.js");

const db = require("./db-access");
const pendingInvites = new Map();
let inviteIterator = 1;
let matchIterator = 1;

const matches = new Map();

function startMatch(whiteId, blackId) {
  return new Chess(whiteId, blackId);
}

async function saveGame(matchId) {
  const match = matches.get(matchId);
  const pgn = match.getPGN();
  const whiteId = match.whiteId;
  const blackId = match.blackId;
  // return await db.saveGame(whiteId, blackId, pgn);
}

function socketInitialize (io) {
  io.on("connection", async (socket) => {
    const userId = socket.request.session.passport.user;
    const username = await db.getUsernameById(userId);
    
    // Emit to a specific user by emitting to their room
    socket.join(`user:${userId}`);
    console.log(`user ${userId} connected`);

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
      } else if (recipientUser.id == userId) {
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
      console.log(`user ${userId} is inviting user ${recipientUser.id}`); // DEBUG

      pendingInvites.set(inviteIterator, {inviter: userId, recipient: recipientUser.id});
      io.to(`user:${recipientUser.id}`).emit("invite-ask", 
                                            username, 
                                            inviteIterator++);
      socket.emit("invite", "Invite sent");
    });

    socket.on("invite-answer", async (answer, inviteId) => {
      // Check that invite id is valid
      if (!pendingInvites.has(inviteId)) {
        socket.emit("invite-answer", "Invalid invite id");
        return;
      }
      if (answer == "accept") { // Accept invite
        const colorIds = [pendingInvites.get(inviteId).inviter, pendingInvites.get(inviteId).recipient];
        shuffle(colorIds); // Randomize white/black player
        matches.set(matchIterator, startMatch(colorIds[0], colorIds[1]));
        // args for startMatch are (matchId, color)
        io.to(`user:${colorIds[0]}`).emit("startMatch", matchIterator, "white");
        io.to(`user:${colorIds[1]}`).emit("startMatch", matchIterator, "black");
        matchIterator++;
      } else { // Decline invite
        io.to(`user:${pendingInvites.get(inviteId).inviter}`).emit("invite-answer", "User declined invite");
        pendingInvites.delete(inviteId);
      }
    });
    
    // MATCH EVENTS ================
    socket.on("makeMove", async (matchId, move) => {
      // Validate move
      const moveRes = matches.get(matchId).makeMove(move);

      if (moveRes.valid) { 
        // move successful, emit to both users in match 
        io.to(`match:${matchId}`).emit("validMove", move);
      } else {
        socket.emit("makeMove", "Invalid move");
      }

      if (moveRes.result != null)
      {
        io.to(`match:${matchId}`).emit("gameOver", moveRes.result);
        if (await saveGame(matchId) == false) 
          console.log("Error saving game");
        matches.delete(matchId);
      }
    });

    socket.on("disconnect", () => {
      console.log("User disconnected");
    });
  });
};

module.exports = socketInitialize;
