import React, { useState, useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";

import PrivateRoute from "./PrivateRoute";
import Home from "./Home";
import Login from "./Login";
import Game from "./Game";
import Register from "./Register";
import Profile from "./Profile";

import { socket } from "./socket.js"

function App() {

  useEffect(() => { // useEffect RUNS TWICE IN DEV ENVIRONMENT

    // Cleanup on component unmount
    return () => {
      // socket.disconnect();
    };
  }, []); // Empty array means this effect runs only once on mount

  window.console.log("App loaded");
  return (
    <div className="App blankbackground container">
      <BrowserRouter>
        <Routes>
          <Route exact path="/" element={<PrivateRoute />}>
            <Route exact path="/" element={<Home/>} />
          </Route>
          <Route path="/login" element={<Login/>} />
          <Route path="/game/:matchId" element={<Game />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
