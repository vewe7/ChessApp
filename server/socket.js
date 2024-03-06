const db = require("./db-access");
const invites = new Map();
let inviteIterator = 1;

function socketInitialize (io) {
  io.on("connection", async (socket) => {

    const userId = socket.request.session.passport.user;
    const username = await db.getUsernameById(userId);
    // Emit to a specific user by emitting to their room
    socket.join(`user:${userId}`);
    console.log(`user ${userId} connected`);

    socket.on("joinInvite", () => {
      socket.join("inviteRoom");
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

    socket.on("disconnect", () => {
      console.log("User disconnected");
    });
  });
};

module.exports = socketInitialize;
