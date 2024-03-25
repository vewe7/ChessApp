import React from "react";
import { useState, useEffect } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import Logout from "./Logout";
import Invite from "./Invite";

const Home = () => {
  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <Invite/>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
      <Logout />
    </> 
  );
};

export default Home;
