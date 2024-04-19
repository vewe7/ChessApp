import React, { Fragment } from "react";
import Invite from "./Invite";
import Header from "./Header";

const Home = ({ curUsername, setCurUsername, searchedUsername, setSearchedUsername }) => {
  
  return (
    <Fragment>
      <Header className="Header" curUsername={curUsername} searchedUsername={searchedUsername} setCurUsername={setCurUsername} setSearchedUsername={setSearchedUsername} />
      <Invite />
    </Fragment>
  );
};

export default Home;
