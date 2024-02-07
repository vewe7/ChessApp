import React, {useEffect, useState} from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const PrivateRoute = () => {
    const [isAuthenticated, userHasAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true); 

    useEffect(() => {
        onLoad().then(() => {
          setLoading(false);
        });
    }, []);
    
    async function onLoad() {
      window.console.log("Private Route OnLoad");
        try {
          const response = await fetch("http://localhost:5000/session", {
            method: "GET",
            credentials: "include",
          });
    
          if (response.ok) {
            userHasAuthenticated(true);
            console.log("Authenticated set");
          } else {
            userHasAuthenticated(false);
            console.log("Unauthenticated set");
          }
        } catch (e) {
          alert(e);
        }
    }

    if (loading) {
      return <div>Loading...</div>; 
    }

    return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
}

export default PrivateRoute;