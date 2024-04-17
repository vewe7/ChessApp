import React from "react";
import Invite from "./Invite";
import Header from "./Header";
import { socket } from "./socket";
import { useEffect, useState } from "react";

const Home = ({ curUsername, setCurUsername, setSearchedUsername }) => {
  
  return (
    
    <div>
      <Header className="Header" curUsername={curUsername} setCurUsername={setCurUsername} setSearchedUsername={setSearchedUsername} />
      <Invite />
    </div>
  );
};

export default Home;
