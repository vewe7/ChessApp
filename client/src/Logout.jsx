import React from "react";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const Logout = ({ setCurUsername, setSearchedUsername }) => {
  const navigate = useNavigate();
  const handleLogout = async () => {
    try { 
      const response = await fetch(`${import.meta.env.VITE_API_URL}/logout`, {
        method: "POST",
        credentials: "include", // Include credentials (cookies) in the request
        headers: {
          "Content-Type": "application/json"
        }
      })
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }   
      document.cookie = `yourAuthToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; HttpOnly`;

      setCurUsername("");
      setSearchedUsername("");

      navigate("/login");

    } catch (error) {
      console.error("Error during logout:", error);
    }
  };
  
  return (
    <Button variant="dark" onClick={handleLogout}>Logout</Button>
  ); 
}

export default Logout;