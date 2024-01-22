const express = require("express");
const cors = require("cors");
const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());
app.use(require("./routes/auth"));

app.get('/', (req, res) => {
    res.redirect('/session');
});

app.listen(PORT, () => {
    console.log("server has started on port " + PORT);
});