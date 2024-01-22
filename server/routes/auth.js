if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

const express = require('express');
const session = require('express-session')
const router = express.Router();
const pool = require("../db");
const path = require("path");
const passport = require("passport");
const bcrypt = require("bcrypt");
const initializePassport = require('../passport-config');
initializePassport(passport);

const CLIENT_PATH = path.join(__dirname, '../..', 'client', 'temp');

router.use(express.urlencoded({ extended: false }));
router.use(express.static(CLIENT_PATH));
router.use(session({
    secret: process.env.SESSION_SECRET, // TO-DO: GENERATE RANDOM SECRET
    resave: false,
    saveUninitialized: false
}));
router.use(passport.initialize())
router.use(passport.session())

// AUTH ROUTES  
router.get('/session', checkAuthenticated, (req, res) => {
    // redirect to homepage
    res.sendFile(path.join(CLIENT_PATH, 'session.html'));
})

router.post("/login", passport.authenticate('local', {
    successRedirect: '/session',
    failureRedirect: '/login'
}));

router.get("/login", (req, res) => {
    // redirect to login page
    res.sendFile(path.join(CLIENT_PATH, 'login.html'));
});

router.post("/register", async (req, res) => {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    // check if username already exists
    const userExistsQuery = await pool.query("SELECT * FROM player WHERE username = $1", [req.body.username]);
    if (userExistsQuery.rows.length > 0) {
        return res.status(400).json({ error: "Username already exists"});
    }
    // insert new user into database
    const insertQuery = await pool.query("INSERT INTO player (username, password_hash) VALUES ($1, $2) RETURNING *", [req.body.username, hashedPassword]);
    // TO-DO: error handling for insert fail
    res.status(201).json({ message: "User registered successfully" });
});

router.get("/error", (req, res) => {
    res.sendFile(path.join(CLIENT_PATH, 'error.html'));
})

// Used by '/' route to redirect to login page if user does not have a valid session
function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
}

module.exports = router;