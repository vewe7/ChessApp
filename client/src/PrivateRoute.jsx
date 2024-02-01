import React, {useEffect, useState} from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const PrivateRoute = () => {
    const [isAuthenticated, userHasAuthenticated] = useState(false);

    useEffect(() => {
        onLoad();
    }, []);
    
    async function onLoad() {
        try {
          const response = await fetch("http://localhost:5000/session", {
            method: "GET",
            credentials: "include",
          });
    
          if (response.ok) {
            userHasAuthenticated(true);
          } else {
            userHasAuthenticated(false);
          }
        } catch (e) {
          alert(e);
        }
    }

    return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
}

export default PrivateRoute;