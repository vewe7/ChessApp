const db = require("./db-access");

function socketInitialize (io) {
  io.on("connection", (socket) => {

    const userId = socket.request.session.passport.user;
    // Emit to a specific user by emitting to their room
    socket.join(`user:${userId}`);
    console.log(`user ${userId} connected`);

    socket.on("joinInvite", () => {
      socket.join("inviteRoom");
    });

    socket.on("invite", ({ from, to }) => {
      console.log(`${from} is inviting ${to}`);
      recipientUser = 
    });

    socket.on("disconnect", () => {
      console.log("User disconnected");
    });
  });
};

module.exports = socketInitialize;
