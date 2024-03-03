import React, { useState, useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";

import PrivateRoute from "./PrivateRoute";
import Home from "./Home";
import Login from "./Login";
import Header from "./Header.jsx";

function App() {
  const [username, setUsername] = useState("");

  window.console.log("App loaded");
  return (
    <div className="App animated-gradient container">
      <Header className="Header" />
      <BrowserRouter>
        <Routes>
          <Route exact path="/" element={<PrivateRoute />}>
            <Route exact path="/" element={<Home username={username}/>} />
          </Route>
          <Route exact path="/login" element={<Login usernameUpdate={setUsername} />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
