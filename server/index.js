const express = require("express");
const pool = require("./db");
const cors = require("cors");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const crypto = require("crypto");
const path = require("path");
const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

passport.use(new LocalStrategy(function verify(username, password, cb) {
    db.get('SELECT * FROM player WHERE username = ?', [ username ], function(err, row) {
        if (err) { return cb(err); }
        if (!row) { return cb(null, false, { message: 'Incorrect username or password.' }); }

        crypto.pbkdf2(password, row.salt, 310000, 32, 'sha256', function(err, hashedPassword) {
        if (err) { return cb(err); }
        if (!crypto.timingSafeEqual(row.hashed_password, hashedPassword)) {
            return cb(null, false, { message: 'Incorrect username or password.' });
        }
        return cb(null, row);
        });
    });
}));

// AUTH ROUTES  
app.post("/login", passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login'
}));

app.get("/login", (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'client', 'failure.html'));
});

app.listen(PORT, () => {
    console.log("server has started on port " + PORT);
});