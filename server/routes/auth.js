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
const jwt = require('jsonwebtoken');
const CLIENT_PATH = path.join(__dirname, '../..', 'temp');

router.use(express.urlencoded({ extended: false }));
router.use(express.static(CLIENT_PATH));
router.use(session({
    secret: process.env.SESSION_SECRET, // TO-DO: GENERATE RANDOM SECRET
    resave: false,
    saveUninitialized: false
}));
router.use(passport.initialize());
router.use(passport.session());

// ROUTES  
router.get('/session', checkAuthenticated, (req, res) => {
    // Redirect to homepage
    res.status(200).send('Success');
});

router.post("/login", checkNotAuthenticated, passport.authenticate('local'), (req, res) => {
    const token = generateSecureToken(req.user);
    res.status(200).json({ token, user: req.user.user, message: 'Login successful'});
});

const generateSecureToken = (user) => {
    // Use jsonwebtoken to create a secure JWT
    const token = jwt.sign({ userId: user.id, username: user.username }, process.env.SESSION_SECRET, { expiresIn: '2h' });
    return token;
  };

router.get("/login", checkNotAuthenticated, (req, res) => {
    // Redirect to login page
    res.sendFile(path.join(CLIENT_PATH, 'login.html'));
});

router.post('/logout', function(req, res, next){
    req.logout(function(err) {
        if (err) { return next(err); }
        res.redirect('/session');
    });
    res.json({ message: 'Logged out successfully.' });
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
});

// Used by /session to check if user has a valid session
function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
}   

function checkNotAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        res.redirect('/session');
    }
    return next();
}



module.exports = router;