if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

const express = require("express");
const pool = require("./db");
const cors = require("cors");
const passport = require("passport");
const bcrypt = require("bcrypt");
const initializePassport = require('./passport-config')
initializePassport(
    passport, 
    user => users.find(element => element.username === user) , // replace with database SELECT
    id => users.find(element => element.id === id) // replace with database SELECT
);
const session = require('express-session')
const path = require("path");
const app = express();
const PORT = 5000;

// Placeholder for database
const users = []

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
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        users.push({  // replace with database INSERT
            id: Date.now().toString(), 
            username: req.body.username,
            password: hashedPassword
        }); 
        res.redirect('/login');
    } catch {
        res.redirect('/error');
    }
    console.log(users)
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