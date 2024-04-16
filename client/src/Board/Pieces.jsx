import "./Pieces.css"
import Piece from "./Piece"
import { initialPosition, makeNewPosition } from "./Position"
import { useState, useRef, useEffect } from "react";

function Pieces({boardArray, currentPosition, setPosition, sendMove}) {
    const ref = useRef();

    function dropSquare(e) {
        // Get and initialize x-pos of left side, and y-pos of bottom side of board
        const {width, top, left} = ref.current.getBoundingClientRect();
        const x0 = left;
        const y0 = top;
        const scale = width/8;

        // Get x-pos and y-pos of where the piece was dropped
        const x = e.clientX;
        const y = e.clientY;
        
        // Calculate and return the new file + rank

        const column = Math.floor((x - x0)/scale);
        const row = Math.floor((y - y0)/scale);

        const endingSquare = boardArray[row][column];

        const endFile = endingSquare.charAt(0);
        const endRank = endingSquare.charAt(1);
        return {endFile, endRank};
    }

    async function onDrop(e) {
        const [type, file, rank] = e.dataTransfer.getData("text").split("-");
        const row = 8 - parseInt(rank);
        const column = file.charCodeAt() - 'a'.charCodeAt();

        const startSquare = boardArray[row][column];
        console.log(startSquare);
        const startFile = startSquare.charAt(0);
        const startRank = startSquare.charAt(1);

        const {endFile, endRank} = dropSquare(e);

        console.log(endFile + endRank);

        // Make a new position, only changing the position of the piece that was moved
        /*
        const nextPosition = makeNewPosition(currentPosition, type, file, rank, newFile, newRank);
        setPosition(nextPosition);*/

        // Send to backend
        sendMove(startFile + startRank, endFile + endRank);
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