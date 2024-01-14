CREATE DATABASE chessapp;

CREATE TABLE player (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(20),
    password_hash VARCHAR(60)
);