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

// ROUTES  
router.get('/session', checkAuthenticated, (req, res) => {
    // Redirect to homepage
    res.sendFile(path.join(CLIENT_PATH, 'session.html'));
})

router.post("/login", passport.authenticate('local', {
    successRedirect: '/session',
    failureRedirect: '/login'
}));

router.get("/login", (req, res) => {
    // Redirect to login page
    res.sendFile(path.join(CLIENT_PATH, 'login.html'));
});

router.post("/register", async (req, res) => {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    // Check if username already exists
    const userExistsCom = "SELECT * FROM player WHERE username = $1";
    const userExistsQuery = await pool.query(userExistsCom, [req.body.username]);
    if (userExistsQuery.rows.length > 0) {
        return res.status(400).json({ error: "Username already exists"});
    }
    // Insert new user into database
    const insertCom = "INSERT INTO player (username, password_hash) VALUES ($1, $2) RETURNING *";
    const insertQuery = await pool.query(insertCom, [req.body.username, hashedPassword]);
    // TO-DO: error handling for insert fail
    res.status(201).json({ message: "User registered successfully" });
});

router.get("/error", (req, res) => {
    res.sendFile(path.join(CLIENT_PATH, 'error.html'));
})

// Used by /session to check if user has a valid session
function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
}

module.exports = router;