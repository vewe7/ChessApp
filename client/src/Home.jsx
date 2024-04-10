import React from "react";
import { useState, useEffect } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import Logout from "./Logout";
import Invite from "./Invite";
import Header from "./Header";

const Home = () => {
  return (
    <>
      <Header className="Header" />
      <Invite />
      <Logout />
    </>
  );
};

export default Home;
