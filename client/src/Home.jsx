import React from "react";
import Invite from "./Invite";
import Header from "./Header";

const Home = ({ curUsername, setCurUsername, setSearchedUsername }) => {
  
  return (
    <div>
      <Header className="Header" curUsername={curUsername} setCurUsername={setCurUsername} setSearchedUsername={setSearchedUsername} />
      <Invite />
    </div>
  );
};

export default Home;
