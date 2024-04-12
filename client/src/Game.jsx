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

    useEffect(() => {
        socket.emit("joinMatchRoom", matchId);
        window.console.log(`Joined match with id ${matchId} as ${color}`);

        // Cleanup
        return () => {
            socket.emit("leaveMatchRoom", matchId);
        };
    }, []);

    return (
        <div className="game">
            <Ranks ranks={ranks}/>
            <Board matchId={matchId}/>
            <Files files={files}/>
        </div>
    )
}

export default Game;