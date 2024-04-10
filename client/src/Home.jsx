import React from "react";
import { useState, useEffect } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import Logout from "./Logout";
import Header from "./Header";
import io from "socket.io-client";

const SOCKET_SERVER_URL = "http://localhost:5000";

const Home = () => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    // Connect to socket server
    const socket = io(SOCKET_SERVER_URL);

    // socket.on('message', handleMessage);

    // Cleanup on component unmount
    return () => {
      socket.disconnect();
    };
  }, []); // Empty array means this effect runs only once on mount

  return (
    <>
      <Header className="Header" />
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
      <Logout />
    </>
  );
};

export default Home;
