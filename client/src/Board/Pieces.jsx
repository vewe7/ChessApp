import "./Pieces.css"
import Piece from "./Piece"
import { initialPosition, makeNewPosition } from "./Position"
import { useState, useRef, useEffect } from "react";

import { socket } from "../socket.js";

function Pieces({matchId}) {
    const ref = useRef();
    const [currentPosition, setPosition] = useState(initialPosition());
    let queuePosition = initialPosition();

    function convertFile(f) {
        return (f.charCodeAt(0) - 'a'.charCodeAt(0));
    }

    function convertRank(r) {
        return (8 - r);
    }

    useEffect(() => {
        socket.removeAllListeners("validMove");
        socket.removeAllListeners("moveError");

        socket.on("validMove", (move, newStatus) => {
            window.console.log("Move received from backend:");
            window.console.log(move);

            const file = move.from[0], rank = move.from[1];
            const newFile = move.to[0], newRank = move.to[1];
            const type = currentPosition[convertRank(rank)][convertFile(file)];

            window.console.log("Moving " + type + " to " + newFile + newRank);

            const nextPosition = makeNewPosition(currentPosition, type, file, rank, newFile, newRank);
            setPosition(nextPosition);
        });

        socket.on("moveError", (error) => {
            window.console.log("Got move error event: " + error);
        });
    }, [currentPosition]);

    function sendMove(from, to) {
        window.console.log("Pieces sending move with matchId: " + matchId);
        socket.emit("makeMove", matchId, {from: from, to: to});
    }

    function dropSquare(e) {
        // Get and initialize x-pos of left side, and y-pos of bottom side of board
        const {width, bottom, left} = ref.current.getBoundingClientRect();
        const x0 = left;
        const y0 = bottom;
        const scale = width/8;

        // Get x-pos and y-pos of where the piece was dropped
        const x = e.clientX;
        const y = e.clientY;
        
        // Calculate and return the new file + rank
        const newFile = String.fromCharCode(97 + Math.floor((x - x0)/scale));
        const newRank = Math.floor(-1*(y - y0)/scale) + 1;
        return {newFile, newRank};
    }

    async function onDrop(e) {
        const [type, file, rank] = e.dataTransfer.getData("text").split("-");
        const {newFile, newRank} = dropSquare(e);

        // Make a new position, only changing the position of the piece that was moved
        /*
        const nextPosition = makeNewPosition(currentPosition, type, file, rank, newFile, newRank);
        setPosition(nextPosition);*/

        // Send to backend
        sendMove(file + rank, newFile + newRank);
    }

    function onDragOver(e) {
        e.preventDefault();
    }

    let pieces = (
        currentPosition.map((rank, r) => 
            rank.map((file, f) => {
                if (currentPosition[r][f] !== "") return <Piece key={f+r} type={currentPosition[r][f]} rank={8-r} file={f}/>;
                else return null;
            })
        )
    );

    return <div ref = {ref} onDrop={onDrop} onDragOver={onDragOver} className="pieces">{pieces}</div>
}

export default Pieces;