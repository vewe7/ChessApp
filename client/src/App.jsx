import React, {useState, useEffect} from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';

import AuthenticatedRoute from './AuthenticatedRoute';
import UnauthenticatedRoute from './UnauthenticatedRoute';
import PrivateRoute from './PrivateRoute';
import Home from './Home';
import Login from './Login';

function App() {
  /*
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
      }
    } catch (e) {
      alert(e);
    }
  }*/
  window.console.log("App loaded");
  return (
    <div className="App container">
      <h1>Welcome to my app</h1>
      <BrowserRouter>
        <Routes>
          <Route exact path='/' element={<PrivateRoute/>}>
            <Route exact path='/' element={<Home/>}/>
          </Route>
          <Route exact path='/login' element={<Login/>}/>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
