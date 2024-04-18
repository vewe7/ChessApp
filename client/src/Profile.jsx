import React, { useEffect, useState } from "react";
import "./App.css";
import Header from "./Header";
import EditBio from "./EditBio";

const Profile = ({ curUsername, setCurUsername, setSearchedUsername }) => {
  const [profileData, setProfileData] = useState('');
  const [pastGames, setPastGames] = useState([]);
  const [bio, setBio] = useState('');

  const getProfileData = async () => {
    try {
      const profileResponse = await fetch(`${import.meta.env.VITE_API_URL}/profile/username/${curUsername}`);
      const profileResponseData = await profileResponse.json();

      setProfileData(profileResponseData);

    } catch (err) {
      console.error(err.message);
    }
  };

  const getPastGames = async () => {
    try {
      const playerMatchesResponse = await fetch(`${import.meta.env.VITE_API_URL}/player_matches/user_id/${profileData.user_id}`);
      const playerMatchesData = await playerMatchesResponse.json();

      const matches = await Promise.all(
        playerMatchesData.map(async (playerMatch) => {
          const matchResponse = await fetch(`${import.meta.env.VITE_API_URL}/matches/match_id/${playerMatch.match_id}`);
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
    if (profileData.user_id !== undefined) {
      getPastGames();
    }
  }, [profileData]);

  useEffect(() => {
    if (profileData.bio) {
      setBio(profileData.bio);
    }
  }, [profileData.bio]);

  function truncateDate(dateString) {
    const date = new Date(dateString);
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    return date.toLocaleDateString(undefined, options);
  }

  return (
    <div>
      <Header className="Header" curUsername={curUsername} setCurUsername={setCurUsername} setSearchedUsername={setSearchedUsername} />
      <div className="BoxDivider" >
        <div className="BoxDiverRows">
          <div className="ProfileBoxes"style={{width:"30vw", height:"40vh"}} >
            <img className="logo" src ="FAFOLogo.svg"></img>
            <h2 style={{fontSize:"40px"}}>{profileData.username}</h2>
            <p style={{fontSize: "20px"}}>Account Opening Date:</p>
            <p style={{fontSize: "20px"}}>{truncateDate(profileData.date_opened)}</p>
          </div>
          <div className="ProfileBoxes"style={{width:"30vw", height:"40vh"}} >
            <h2 style={{fontSize: "35px"}}>Bio</h2>
            <div className="d-flex" style={{flexDirection: "column", alignItems: "center", justifyContent: "space-between", height: "100%"}}>
              <p style={{fontSize: "20px"}}>{profileData.bio}</p>
              <EditBio profileData={profileData} bio={bio} setBio={setBio}/>
            </div>
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
                  <div key={pastGame.match_id} style={{ textAlign: 'left' }}>
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
  );
}

export default Profile;