import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = ({ usernameUpdate }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      // Send login request to bcakend
      const response = await fetch("http://localhost:5000/login", {
        method: "POST",
        credentials: "include", // Include credentials (cookies) in the request
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });
      // Throw error if login failed
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      // Login successful, set session cookie and redirect to home
      const data = await response.json();
      document.cookie = `yourAuthToken=${data.token}; path=/; HttpOnly`;
      usernameUpdate(username);
      navigate("/");
    } catch (error) {
      console.error("Error during login:", error);
    }
  };

  return (
    <div>
<<<<<<< HEAD
      <div className="BoxBackground">
        <h1>Login</h1>
        <label>
          Username:
          <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
        </label>
        <br />
        <label>
          Password:
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </label>
        <br />
        <button className="porple" onClick={handleLogin}>
          Login
        </button>
=======
      <div className="LoginRegisterBoxes">
        <div className="BoxBackground">
          <h1>Login</h1>
          <label>
            Username:
            <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
          </label>
          <br />
            <label>
              Password:
              < input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </label>
          <br />
          <button className="porple" onClick={handleLogin} >Sign In</button>
        </div>

        <div className="BoxBackground">
          <h1>Don't Have An Account?</h1>
          <button className="porple" >Sign Up</button>
        </div>
>>>>>>> logoBranch
      </div>

      <div className="porple">
        <div class="rev">
<<<<<<< HEAD
          <body>My mom and I play on this site! It's so awesome!!!</body>
          <label>-Nikki</label>
        </div>
        <div class="rev">
          <body>
            I keep losing to so manny different people :( But atleast I'm
            learning!
          </body>
          <label>-Michael</label>
        </div>
        <div class="rev">
          <body>
            {" "}
            9/10 chess players reccomend this site. The last one was being a
            silly billy ;)
          </body>
=======
          <p>My mom and I play on this site! It's so awesome!!!</p>  
          <label>-Nikki</label>
        </div>
        <div class="rev">
          <p>I keep losing to so manny different people :( But atleast I'm learning!</p>
          <label>-Michael</label>
        </div>
        <div class="rev">
          <p> 9/10 chess players reccomend this site. The last one was being a silly billy ;)</p>
>>>>>>> logoBranch
          <label>-Shadman</label>
        </div>
      </div>
    </div>
  );
};

export default Login;
