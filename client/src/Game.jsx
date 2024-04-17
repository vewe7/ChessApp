import React, { useEffect, useState } from "react";
import "./App.css";
import './Game.css'
import { useParams } from "react-router-dom";
import { socket } from "./socket.js";
import { initialPosition, makeNewPosition } from "./Board/Position"
import { initialBoard } from "./Board/FlipBoard.jsx"

import Files from './Border/Files'
import Ranks from './Border/Ranks'
import Board from './Board/Board'
import Panel from './Panel/Panel'

function Game() {
    const [ranks, setRanks] = useState([8, 7, 6, 5, 4, 3, 2, 1]);
    const [files, setFiles] = useState(['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']);

    const { matchId, color } = useParams();
    const [currentPosition, setPosition] = useState(initialPosition());
    const [whiteTime, setWhiteTime] = useState(0); 
    const [blackTime, setBlackTime] = useState(0);
    const [turn, setTurn] = useState("w");

    const [board, setBoard] = useState(initialBoard());

    function convertFile(f, isFlipped) {
        const curFile = f.charCodeAt(0) - 'a'.charCodeAt(0);
        return (isFlipped ? 7 - curFile : curFile);
    }

    function convertRank(r, isFlipped) {
        const curRank = 8 - r;
        return (isFlipped ? 7 - curRank : curRank);
    }

    function sendMove(from, to, promotion) {
        window.console.log("Pieces sending move with matchId: " + matchId);
        socket.emit("makeMove", parseInt(matchId), {from: from, to: to, promotion: promotion});
    }

    useEffect(() => {
        function updateClock(color, time) {
            if (color == "w") 
                setWhiteTime(time);
            else 
                setBlackTime(time);
        }

        function updateValidMove(move, newStatus) {
            // window.console.log("Move received from backend:");
            // window.console.log(move);
            if (newStatus != "none") 
                window.console.log("This move caused: " + newStatus); // PLACEHOLDER, replace with ui feedback

            const file = move.from[0], rank = move.from[1];
            const newFile = move.to[0], newRank = move.to[1];

            const isFlipped = (board[0][0] === "a8" ? false : true);
            const type = currentPosition[convertRank(rank, isFlipped)][convertFile(file, isFlipped)];

            window.console.log("Moving " + type + " to " + newFile + newRank);

            const nextPosition = makeNewPosition(currentPosition, type, file, rank, newFile, newRank, board);
            setPosition(nextPosition);

            if (turn == "w") 
                setTurn("b");
            else 
                setTurn("w");
        }

        socket.on("updateClock", updateClock);
        socket.on("validMove", updateValidMove);
        socket.on("moveError", (error) => {
            window.console.log("Got move error event: " + error);
        });

        socket.emit("joinMatchRoom", parseInt(matchId));
        window.console.log(`Joined match with id ${matchId} as ${color}`);

        // Cleanup
        return () => {
            socket.emit("leaveMatchRoom", parseInt(matchId));
            socket.off("updateClock", updateClock);
            socket.off("validMove", updateValidMove);
            socket.off("moveError");
        };
    }, [currentPosition]);

    return (
        <div className="game">
            <div className="chess">
                <Ranks ranks={ranks}/>
                <Board boardArray={board} setBoard={setBoard} currentPosition={currentPosition} setPosition={setPosition} sendMove={sendMove}/>
                <Files files={files}/>
            </div>
            <Panel 
                whiteTime={whiteTime}
                blackTime={blackTime}
                boardArray={board}
                setBoard={setBoard}
                currentPosition={currentPosition}
                setPosition={setPosition}
                ranks={ranks}
                setRanks={setRanks}
                files={files}
                setFiles={setFiles}
            />
        </div>
    )
}

export default Game;