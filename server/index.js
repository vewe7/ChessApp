const express = require("express")
const app = express();
const PORT = 5000;
const cors = require("cors");

app.use(cors());
app.use(express.json());

app.listen(PORT, () => {
    console.log("server has started on port " + PORT);
});