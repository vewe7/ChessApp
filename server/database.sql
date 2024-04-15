CREATE DATABASE chessapp;

\c chessapp 

CREATE TABLE player (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(20),
    password_hash VARCHAR(60)
);

ALTER TABLE player ADD CONSTRAINT username_unique UNIQUE (username);

CREATE TABLE profile (
    user_id INT PRIMARY KEY REFERENCES player(user_id) ON DELETE CASCADE,
    username VARCHAR(20) REFERENCES player(username),
    bio TEXT DEFAULT '',
    wins INT DEFAULT 0,
    losses INT DEFAULT 0,
    draws INT DEFAULT 0
);