import React, { useEffect, useState } from "react";
import "./App.css";
import Header from "./Header";
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

const Profile = ({ curUsername, setSearchedUsername }) => {
  const [show, setShow] = useState(false);
  const [profileData, setProfileData] = useState('');
  const [pastGames, setPastGames] = useState([]);
  const [bio, setBio] = useState('');

  const handleClose = () => {
    setShow(false);
    setBio(profileData.bio);
  };
  const handleShow = () => setShow(true);

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

  useEffect(() => {
    if (profileData.bio) {
      setBio(profileData.bio);
    }
  }, [profileData.bio]);

  const updateBio = async (e) => {
    e.preventDefault();
    try {
        const body = { bio };
        const response = await fetch(`http://localhost:5000/profile/bio/${profileData.username}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body)
        });
        const responseData = await response.json();

        if (!response.ok) {
            throw new Error(responseData.error);
        }

        window.location.reload();
    } catch (err) {
        console.error(err.message);
    }
  };

  function truncateDate(dateString) {
    const date = new Date(dateString);
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    return date.toLocaleDateString(undefined, options);
  }

  return (
    <div>
      <Header 
        className="Header" 
        curUsername={curUsername} 
        setSearchedUsername={setSearchedUsername} 
      />
      <div className="BoxDivider" >
        <div className="BoxDiverRows">
          <div className="ProfileBoxes"style={{width:"30vw", height:"40vh"}} >
            <img className="logo" src ="FAFOLogo .svg"></img>
            <h2 style={{fontSize:"40px"}}>{profileData.username}</h2>
            <p style={{fontSize: "20px"}}>Account Opening Date:</p>
            <p style={{fontSize: "20px"}}>{truncateDate(profileData.date_opened)}</p>
          </div>
          <div className="ProfileBoxes"style={{width:"30vw", height:"40vh"}} >
            <h2 style={{fontSize: "35px"}}>Bio</h2>
            <div className="d-flex" style={{flexDirection: "column", alignItems: "center", justifyContent: "space-between", height: "100%"}}>
              <p style={{fontSize: "20px"}}>{profileData.bio}</p>
              <Button variant="secondary" style={{margin: "20px", maxWidth: "100px"}} onClick={handleShow}>
                Edit Bio
              </Button>
              <Modal
                show={show}
                onHide={handleClose}
                backdrop="static"
                keyboard={false}
              >
                <Modal.Header closeButton>
                  <Modal.Title>Edit Bio</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                <InputGroup>
                  <Form.Control as="textarea" value={bio} onChange={e => setBio(e.target.value)}/>
                </InputGroup>
                </Modal.Body>
                <Modal.Footer>
                  <Button variant="dark" onClick={handleClose}>
                    Close
                  </Button>
                  <Button variant="secondary" onClick={e => updateBio(e)}>Submit</Button>
                </Modal.Footer>
              </Modal>
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
  )
}

export default Profile;