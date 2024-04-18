import React from 'react';
import { Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const Logout = ({ setCurUsername }) => {
  const navigate = useNavigate();
  const handleLogout = async () => {
    try { 
      const response = await fetch('http://localhost:5000/logout', {
        method: 'POST',
        credentials: 'include', // Include credentials (cookies) in the request
        headers: {
          'Content-Type': 'application/json'
        }
      })
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }   
      document.cookie = `yourAuthToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; HttpOnly`;

      setCurUsername('');

      navigate("/login");

    } catch (error) {
      console.error('Error during logout:', error);
    }
  };
  
  return (
    <Button variant='dark' onClick={handleLogout}>Logout</Button>
  ); 
}

export default Logout;