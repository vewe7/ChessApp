const { Chess } = require('chess.js')

const db = require("./db-access");
const pendingInvites = new Map();
let inviteIterator = 1;
let matchIterator = 1;

const matches = new Map();

function startMatch(whiteUsername, blackUsername) {
  const chess = new Chess();
  chess.header("White", whiteUsername, "Black", blackUsername);

  const date = new Date();
  chess.header("Date", `${date.getMonth()}-${date.getDate()}-${date.getFullYear()}`);

  return chess;
}

async function saveGame(matchId) {
  const match = matches.get(matchId);
  const pgn = match.getPGN();
  const whiteId = match.whiteId;
  const blackId = match.blackId;
  // return await db.saveGame(whiteId, blackId, pgn);
}

async function endGame(matchId) {
  if (await saveGame(matchId) == false) 
    console.log("Error saving game");
  matches.delete(matchId);
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

      pendingInvites.set(inviteIterator, {inviter: {id: userId, username: username}, recipientUser});
      io.to(`user:${recipientUser.id}`).emit("inviteAsk", 
                                            username, 
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
      } else { // Decline invite
        io.to(`user:${pendingInvites.get(inviteId).inviter}`).emit("inviteAnswer", "User declined invite");
        pendingInvites.delete(inviteId);
      }
    });
    
    // MATCH EVENTS ================
    socket.on("makeMove", async (matchId, move) => {
      try {
        let newStatus = "none";
        chess.move(move);

        // Check if move caused game state to change
        if (chess.isGameOver()) {
          if (chess.isCheckmate()) 
            newStatus = "checkmate";
          if (chess.isDraw()) 
            newStatus = "draw";
          if (chess.isStalemate())
            newStatus = "stalemate";
          if (chess.isThreefoldRepetition())
            newStatus = "threefold";

          endGame(matchId);
        } else if (chess.in_check()) {
          newStatus = "check";
        }

        io.to(`match:${matchId}`).emit("validMove", move, newStatus);
      } catch (error) {
        socket.emit("makeMove", "Invalid move");
      }
    });

    socket.on("disconnect", () => {
      console.log("User disconnected");
    });
  });
};

module.exports = socketInitialize;
