import React, { useState, useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";

import PrivateRoute from "./PrivateRoute";
import Home from "./Home";
import Login from "./Login";
import Game from "./Game";
import Register from "./Register";
import Profile from "./Profile";
import SearchedProfile from "./SearchedProfile";

import { socket } from "./socket.js"

function App() {
  const [curUsername, setCurUsername] = useState(localStorage.getItem('curUsername') || '');
  const [searchedUsername, setSearchedUsername] =useState(localStorage.getItem('searchedUsername') || '');

  useEffect(() => {
    localStorage.setItem('curUsername', curUsername);
  }, [curUsername]);
  useEffect(() => {
    localStorage.setItem('searchedUsername', searchedUsername);
  }, [searchedUsername]);

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
          <Route element={<PrivateRoute />}>
            <Route exact path="/" element={<Home curUsername={curUsername} setCurUsername={setCurUsername} setSearchedUsername={setSearchedUsername} />} />
            <Route path="/profile" element={<Profile curUsername={curUsername} setSearchedUsername={setSearchedUsername} />} />
            <Route path="/searched-profile" element={<SearchedProfile curUsername={curUsername} searchedUsername={searchedUsername} setSearchedUsername={setSearchedUsername} />} />
            <Route path="/game/:matchId/:color" element={<Game />} />
          </Route>
          <Route path="/login" element={<Login setCurUsername={setCurUsername} />} />
          <Route path="/register" element={<Register setCurUsername={setCurUsername} />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
