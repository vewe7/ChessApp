import React, { useState } from "react";
import "./App.css";
import Header from "./Header";

function Profile() {
  return (
    <div>
      <Header />
      <div className="BoxDivider" >
        <div className="BoxDiverRows">
          <div className="ProfileBoxes"style={{width:"30vw", height:"40vh"}} >
            <img className="logo" src ="FAFOLogo .svg"></img>
            <h2 style={{fontSize:"40px"}}>USERNAME</h2>
          </div>
          <div className="ProfileBoxes"style={{width:"30vw", height:"40vh"}} >
            <h2 style={{fontSize: "35px"}}>Bio</h2>
          </div>
        </div>

        <div className="BoxDividerRows">
          <div className="ProfileBoxes" style={{width:"55vw", height:"30vh"}} >
              <div className="StatBoxes">
                <h1>Record</h1>
                <div className="UnderlineBox"></div>
                <div className="WinLossBoxes">
                    <div className="StatBoxes">
                      <h3>Wins</h3>
                    </div>
                    <div className="StatBoxes">
                      <h3>Losses</h3>
                    </div>
                    <div className="StatBoxes">
                      <h3>Draws</h3>
                    </div>
                </div>
              </div>
            </div>
          <div className="ProfileBoxes" style={{width:"55vw", height:"40vh"}} >
            <div className="StatBoxes" >
              <h1>Past Games</h1>
            </div>
        </div>
        </div>
      </div>
    </div>
  )
}

export default Profile;