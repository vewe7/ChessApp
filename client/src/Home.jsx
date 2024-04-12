import React from "react";
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
