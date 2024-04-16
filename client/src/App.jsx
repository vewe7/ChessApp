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
  // Temporarily used to get username from login component
  const [curUsername, setCurUsername] = useState(localStorage.getItem('curUsername') || '');

  // Save username to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('curUsername', curUsername);
  }, [curUsername]);

  useEffect(() => {
    socket.connect();
    // Cleanup on component unmount
    return () => {
      socket.disconnect();
    };
  }, []); // Empty array means this effect runs only once on mount

  window.console.log("App loaded");
  return (
    <div className="App blankbackground">
      <BrowserRouter>
        <Routes>
          <Route exact path="/" element={<PrivateRoute />}>
            <Route exact path="/" element={<Home curUsername={curUsername} setCurUsername={setCurUsername} />} /> {/* Temporarily uses and sets username */}
          </Route>
          <Route path="/login" element={<Login setCurUsername={setCurUsername} />} /> {/* Temporarily sets username */}
          <Route path="/game/:matchId/:color" element={<Game />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<Profile curUsername={curUsername} />} />
          <Route path="/home" element={<Home curUsername={curUsername} setCurUsername={setCurUsername} />} /> {/* Temporarily uses and sets username */}
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
