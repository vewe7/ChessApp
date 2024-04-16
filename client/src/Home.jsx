import React from "react";
import Logout from "./Logout";
import Invite from "./Invite";
import Header from "./Header";
import { socket } from "./socket";
import { useEffect, useState } from "react";

const Home = ({ curUsername, setCurUsername, setSearchedUsername }) => {
  
  return (
    <>
      <Header 
        className="Header" 
        curUsername={curUsername} 
        setSearchedUsername={setSearchedUsername} 
      />
      <Invite />
      <Logout setCurUsername={setCurUsername} />
    </>
  );
};

export default Home;
