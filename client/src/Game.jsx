import "./App.css";
import "./Game.css"
import React, { Fragment, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { socket } from "./socket.js";
import { initialPosition, makeNewPosition } from "./Board/Position"
import { initialBoard } from "./Board/FlipBoard.jsx"
import { flipBoard } from "./Board/FlipBoard.jsx"
import { flipPosition } from "./Board/Position.jsx"
import GameHeader from "./GameHeader";
import GameOver from "./GameOver.jsx";

import Files from "./Border/Files"
import Ranks from "./Border/Ranks"
import Board from "./Board/Board"
import Panel from "./Panel/Panel"

function Game() {
    const [isGameOver, setIsGameOver] = useState(
        localStorage.getItem("isGameOver") === "true"
    );
    const [status, setStatus] = useState(localStorage.getItem("status") || "");
    const [winner, setWinner] = useState(localStorage.getItem("winner") || "");

    const { matchId, color } = useParams();

    const rankNumbers = [8, 7, 6, 5, 4, 3, 2, 1];
    const fileLetters = ["a", "b", "c", "d", "e", "f", "g", "h"];

    const initial_ranks = color === "white" ? rankNumbers : rankNumbers.slice().reverse();
    const initial_files = color === "white" ? fileLetters : fileLetters.slice().reverse();
    const initial_position = color === "white" ? initialPosition() : flipPosition(initialPosition());
    const initial_board = color === "white" ? initialBoard() : flipBoard(initialBoard());

    const [ranks, setRanks] = useState(initial_ranks);
    const [files, setFiles] = useState(initial_files);
    const [currentPosition, setPosition] = useState(initial_position);
    const [bottomTime, setBottomTime] = useState(0); 
    const [topTime, setTopTime] = useState(0);
    const [turn, setTurn] = useState("w");
    const [board, setBoard] = useState(initial_board);

    function convertFile(f, isFlipped) {
        const curFile = f.charCodeAt(0) - "a".charCodeAt(0);
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

    function sendDrawOffer() {
        socket.emit("offerDraw", parseInt(matchId));
    }

    function sendResignation() {
        socket.emit("resign", parseInt(matchId));
    }

    useEffect(() => {
        function updateClock(color, time) {
            if (color == "w") {
                if (board[0][0] === "a8") setBottomTime(time);
                else setTopTime(time);
            }

            else {
                if (board[0][0] === "a8") setTopTime(time);
                else setBottomTime(time);
            }
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
        
        function updateGameOver(statusParam, colorParam) {
            setIsGameOver(true);
            localStorage.setItem("isGameOver", true);
            setStatus(statusParam);
            localStorage.setItem("status", statusParam);
            setWinner(colorParam);
            localStorage.setItem("winner", colorParam);
            window.console.log("Game over! Status: " + statusParam + " Winner: " + colorParam);
        }

        socket.on("updateClock", updateClock);
        socket.on("validMove", updateValidMove);
        socket.on("moveError", (error) => {
            window.console.log("Got move error event: " + error);
        });
        socket.on("gameOver", updateGameOver);

        socket.emit("joinMatchRoom", parseInt(matchId));
        window.console.log(`Joined match with id ${matchId} as ${color}`);

        // Cleanup
        return () => {
            console.log("Game.jsx cleanup");
            socket.emit("leaveMatchRoom", parseInt(matchId));
            socket.off("updateClock", updateClock);
            socket.off("validMove", updateValidMove);
            socket.off("moveError");
            socket.off("gameOver", updateGameOver);
        };
    }, [currentPosition, isGameOver]);

    return (
        <Fragment>
            <GameHeader className="Header" />
            <div className="container-fluid d-flex justify-content-center">
                <div className="game">
                    <div className="chess">
                        <Ranks ranks={ranks}/>
                        <Board boardArray={board} setBoard={setBoard} currentPosition={currentPosition} setPosition={setPosition} sendMove={sendMove}/>
                        <Files files={files}/>
                    </div>
                    <Panel 
                        bottomTime={bottomTime}
                        setTopTime={setTopTime}
                        topTime={topTime}
                        setBottomTime={setBottomTime}
                        boardArray={board}
                        setBoard={setBoard}
                        currentPosition={currentPosition}
                        setPosition={setPosition}
                        ranks={ranks}
                        setRanks={setRanks}
                        files={files}
                        setFiles={setFiles}
                        sendDrawOffer={sendDrawOffer}
                        sendResignation={sendResignation}
                    />
                </div>
            </div>
            {((isGameOver === true) && (
                <GameOver status={status} winner={winner} setIsGameOver={setIsGameOver} setStatus={setStatus} setWinner={setWinner} />
            ))}
        </Fragment>
    )
}

export default Game;