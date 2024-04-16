import React, { useEffect, useState } from "react";
import "./App.css";
import Header from "./Header";

const Profile = ({ curUsername }) => {
  const [profileData, setProfileData] = useState('');
  const [pastGames, setPastGames] = useState([]);

  const getProfileData = async () => {
    try {
      const profileResponse = await fetch(`http://localhost:5000/profile/username/${curUsername}`);
      const profileResponseData = await profileResponse.json();

      setProfileData(profileResponseData);

    } catch (err) {
      console.error(err.message);
    }
  };

  const getPastGames = async () => {
    try {
      const playerMatchesResponse = await fetch(`http://localhost:5000/player_matches/user_id/${profileData.user_id}`);
      const playerMatchesData = await playerMatchesResponse.json();

      const matches = await Promise.all(
        playerMatchesData.map(async (playerMatch) => {
          const matchResponse = await fetch(`http://localhost:5000/matches/match_id/${playerMatch.match_id}`);
          const matchData = await matchResponse.json();

          return matchData;
        })
      );

      setPastGames(matches);

    } catch (err) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    getProfileData();
  }, []);

  useEffect(() => {
    getPastGames();
  }, [profileData]);

  return (
    <div>
      <Header className="Header" curUsername={curUsername} />
      <div className="BoxDivider" >
        <div className="BoxDiverRows">
          <div className="ProfileBoxes"style={{width:"30vw", height:"40vh"}} >
            <img className="logo" src ="FAFOLogo .svg"></img>
            <h2 style={{fontSize:"40px"}}>{curUsername}</h2>
          </div>
          <div className="ProfileBoxes"style={{width:"30vw", height:"40vh"}} >
            <h2 style={{fontSize: "35px"}}>Bio</h2>
            <p style={{fontSize: "20px"}}>{profileData.bio}</p>
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
                      <h3>{profileData.wins}</h3>
                    </div>
                    <div className="StatBoxes">
                      <h3>Losses</h3>
                      <h3>{profileData.losses}</h3>
                    </div>
                    <div className="StatBoxes">
                      <h3>Draws</h3>
                      <h3>{profileData.draws}</h3>
                    </div>
                </div>
              </div>
            </div>
          <div className="ProfileBoxes" style={{width:"55vw", height:"40vh"}} >
            <div className="StatBoxes" >
              <h1>Past Games</h1>
              <div className="UnderlineBox"></div>
              <div style={{ maxHeight: '100%', overflowY: 'auto', width: '100%' }}>
                {pastGames.map(pastGame => (
                  <div style={{ textAlign: 'left' }}>
                    <h3 style={{ marginTop: '20px' }}>Match ID: {pastGame.match_id}</h3>
                    <p style={{ whiteSpace: 'pre-line' }}>{pastGame.pgn}</p>
                    <br />
                  </div>
                ))}
              </div>
            </div>
        </div>
        </div>
      </div>
    </div>
  )
}

export default Profile;