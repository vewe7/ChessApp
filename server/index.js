if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

const express = require("express");
const pool = require("./db");
const cors = require("cors");
const passport = require("passport");
const bcrypt = require("bcrypt");
const initializePassport = require('./passport-config')
initializePassport(passport);
const session = require('express-session')
const path = require("path");
const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, '..', 'client', 'temp')));
app.use(session({
    secret: process.env.SESSION_SECRET, // TO-DO: GENERATE RANDOM SECRET
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize())
app.use(passport.session())

// AUTH ROUTES  
app.get('/', checkAuthenticated, (req, res) => {
    // redirect to homepage
    res.sendFile(path.join(__dirname, '..', 'client', 'temp', 'session.html'));
})

app.post("/login", passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login'
}));

app.get("/login", (req, res) => {
    // redirect to login page
    res.sendFile(path.join(__dirname, '..', 'client', 'temp', 'login.html'));
});

app.post("/register", async (req, res) => {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    // check if username already exists
    const userExistsQuery = await pool.query("SELECT * FROM player WHERE username = $1", [req.body.username]);
    if (userExistsQuery.rows.length > 0) {
        return res.status(400).json({ error: "Username already exists"});
    }
    // insert new user into database
    const insertQuery = await pool.query("INSERT INTO player (username, password_hash) VALUES ($1, $2) RETURNING *", [req.body.username, hashedPassword]);
    res.status(201).json({ message: "User registered successfully" });
});

app.get("/error", (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'client', 'temp', 'error.html'));
})

// Used by '/' route to redirect to login page if user does not have a valid session
function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }

    res.redirect('/login');
}

app.listen(PORT, () => {
    console.log("server has started on port " + PORT);
});