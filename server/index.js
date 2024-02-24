const express = require("express");
const cors = require("cors");
const http = require("http");
const socket = require("./socket");

const app = express();
const PORT = 5000;

// Create explicit HTTP server for Express app
const server = http.createServer(app);

app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());
app.use(require("./routes/auth"));

app.get("/", (req, res) => {
  res.redirect("/session");
});

socket(server);

server.listen(PORT, () => {
  console.log("server has started on port " + PORT);
});
