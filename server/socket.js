const socketInitialize = (io) => {

  io.on("connection", (socket) => {
    const user = socket.request.user;
    console.log(user);
    const userId = socket.request.user.id;
    // user ID used as room to easily broadcast to a specific user
    socket.join(`user:${userId}`);
    console.log(`user ${userId} connected`);

    socket.on("joinInvite", () => {
      socket.join("inviteRoom");
      console.log(`user ${userId} joined invite room`);
    });

    socket.on("invite", ({ from, to }) => {
      console.log(`${from} is inviting ${to}`);
    });

    socket.on("disconnect", () => {
      console.log("User disconnected");
    });
  });
};

module.exports = socketInitialize;
