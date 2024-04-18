import React, { Fragment, useEffect, useState } from "react";
import "./App.css";
import Header from "./Header";
import { Accordion, Card, Container, Table } from "react-bootstrap";

const SearchedProfile = ({ curUsername, setCurUsername, searchedUsername, setSearchedUsername }) => {
  const [profileData, setProfileData] = useState('');
  const [pastGames, setPastGames] = useState([]);

  const getProfileData = async () => {
    try {
      const profileResponse = await fetch(`http://localhost:5000/profile/username/${searchedUsername}`);
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

      matches.reverse();

      setPastGames(matches);

    } catch (err) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    if (searchedUsername !== '') {
      getProfileData();
    }
  }, [searchedUsername]);

  useEffect(() => {
    if (profileData.user_id !== undefined) {
      getPastGames();
    }
  }, [profileData]);

  function truncateDate(dateString) {
    const date = new Date(dateString);
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    return date.toLocaleDateString(undefined, options);
  }

  return (
    <Fragment>
      <Header className="Header" curUsername={curUsername} setCurUsername={setCurUsername} setSearchedUsername={setSearchedUsername} />
      <Container className="d-flex flex-row justify-content-evenly mt-5" style={{ width:'100vw', height:'80vh' }}>
        <Card bg="light" text="dark" border="dark" style={{ width:'35%', minWidth: '260px', display:"inline-block", borderWidth: '2px' }}>
          <Card.Body style={{margin: '0px 0px 16px', padding: '16px 0px 16px', borderBottom: '1px solid black', borderTop: '1px solid black' }}>
            <Card.Title>{profileData.username}</Card.Title>
            <Card.Text>
              Account Opening Date: {truncateDate(profileData.date_opened)}
            </Card.Text>
          </Card.Body>
          <Card.Body style={{margin: '0px 0px 16px', padding: '0px 0px 16px', borderBottom: '1px solid black'}}>
            <Card.Title>Bio</Card.Title>
            <Card.Text>
              {profileData.bio ? profileData.bio : "This user hasn't added a bio yet."}
            </Card.Text>
          </Card.Body>
          <Card.Body style={{margin: '0px', padding: '0px 0px 16px', borderBottom: '1px solid black'}}>
            <Card.Title>Stats</Card.Title>
            <Table variant="light" borderless style={{ margin: '0px'}}>
              <tbody>
                <tr>
                  <td>Wins: {profileData.wins}</td>
                  <td>Losses: {profileData.losses}</td>
                  <td>Draws: {profileData.draws}</td>
                </tr>
              </tbody>
            </Table>
          </Card.Body>
        </Card>
        <Card bg="light" text="dark" border="dark" style={{ width:'50%', display:"inline-block", borderWidth: '2px' }}>
          <Card.Body style={{ margin: '0px', padding: '16px 0px 16px', borderTop: '1px solid black' }}>
            <Card.Title style={{ margin: '0px'}}>Previous Games</Card.Title>
          </Card.Body>
          <Card.Body style={{ maxHeight: '90%', overflowY: 'auto', border: '1px solid black', borderRadius: '3px' }}> 
            <Accordion >
              {pastGames.map(pastGame => (
                <Accordion.Item key={pastGame.match_id} eventKey={pastGame.match_id}>
                  <Accordion.Header>Game ID: {pastGame.match_id}</Accordion.Header>
                  <Accordion.Body style={{ whiteSpace: 'pre-line', textAlign: 'left' }}>
                    {pastGame.pgn}
                  </Accordion.Body>
                </Accordion.Item>
              ))}
            </Accordion>
          </Card.Body>
        </Card>
      </Container>
    </Fragment>
  )
}

export default SearchedProfile;