const passport = require("passport");
const express = require("express");
const session = require('express-session')
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const socket = require("./socket");
const auth = require("./routes/auth")

const app = express();
const PORT = 5000;

// Create explicit HTTP server for Express app
const server = http.createServer(app);

app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());
app.use(auth.router);

app.get("/", (req, res) => {
  res.redirect("/session");
});

const io = new Server(server, { 
  cors: {
    origin: "http://localhost:5173",
    credentials: true
  }
});

auth.initializeIo(io);
socket(io);

server.listen(PORT, () => {
  console.log("server has started on port " + PORT);
});
