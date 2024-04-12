import React, { useEffect, useState } from "react";
import "./App.css";
import './Game.css'
import { useParams } from "react-router-dom";
import { socket } from "./socket.js";

import Files from './Border/Files'
import Ranks from './Border/Ranks'
import Board from './Board/Board'

const ranks = [8, 7, 6, 5, 4, 3, 2, 1];
const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];

function Game() {
    const { matchId, color } = useParams();
    const [whiteTime, setWhiteTime] = useState(0); 
    const [blackTime, setBlackTime] = useState(0);

    // Convert milliseconds to string with format "MM:SS" 
    function msToTimeString(milliseconds) {
        const totalSeconds = Math.floor(milliseconds / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
    
        const formattedMinutes = String(minutes).padStart(2, '0');
        const formattedSeconds = String(seconds).padStart(2, '0');
        
        return `${formattedMinutes}:${formattedSeconds}`;
    }

    useEffect(() => {
        socket.removeAllListeners("updateClock");
        socket.on("updateClock", (color, time) => {
            if (color == "w") 
                setWhiteTime(time);
            else 
                setBlackTime(time);
        });

        socket.emit("joinMatchRoom", parseInt(matchId));
        window.console.log(`Joined match with id ${matchId} as ${color}`);

        // Cleanup
        return () => {
            socket.emit("leaveMatchRoom", parseInt(matchId));
        };
    }, []);

    return (
        <>
            <div className="game">
                <Ranks ranks={ranks}/>
                <Board matchId={matchId}/>
                <Files files={files}/>
            </div>
            <div className="clockTemp">W {msToTimeString(whiteTime)} | B {msToTimeString(blackTime)}</div>
        </>
    )
}

export default Game;