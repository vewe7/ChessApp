const express = require("express")
const pool = require("./db");
const cors = require("cors");
const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

app.listen(PORT, () => {
    console.log("server has started on port " + PORT);
});

// ROUTES 
