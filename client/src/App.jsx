import React, { useState, useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";

import PrivateRoute from "./PrivateRoute";
import Home from "./Home";
import Login from "./Login";
import Header from "./Header.jsx";
import Game from "./Game";

import { socket } from "./socket.js"

function App() {

  useEffect(() => {

    // Cleanup on component unmount
    return () => {
      socket.disconnect();
    };
  }, []); // Empty array means this effect runs only once on mount

  window.console.log("App loaded");
  return (
    <div className="App animated-gradient container">
      <BrowserRouter>
        <Header className="Header" />
        <Routes>
          <Route exact path="/" element={<PrivateRoute />}>
            <Route exact path="/" element={<Home/>} />
          </Route>
          <Route exact path="/login" element={<Login/>} />
          <Route exact path="/game" element={<Game />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
