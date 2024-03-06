const db = require("./db-access");

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
      const recipientUser = await db.getUserByUsername(to);
      if (recipientUser == null) {
        socket.emit("invite", "User not found");
        return;
      } else if (recipientUser.id == userId) {
        socket.emit("invite", "Cannot invite self");
        return;
      }
      const recipientSockets = await io.in(`user:${userId}`).fetchSockets();
      if (recipientSockets.length == 0) {
        socket.emit("invite", "User not online");
        return;
      }
      console.log(`user ${userId} is inviting user ${recipientUser.id}`);
      io.to(`user:${recipientUser.id}`).emit("invite-ask", `User ${username} has invited you`, userId);
      socket.emit("invite", "Invite sent");
    });

    socket.on("disconnect", () => {
      console.log("User disconnected");
    });

    socket.on("invite-answer", async (answer, inviterId) => {
      if (answer == "accept") {
        console.log("User accepted invite from id " + inviterId);
      } else { 
        console.log("User declined invite from id " + inviterId);
      }
    });
  });
};

module.exports = socketInitialize;
