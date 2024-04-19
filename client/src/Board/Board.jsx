import Pieces from "./Pieces"
import "./Board.css"
import "../constants.css"
import { useEffect } from "react";

function Board({boardArray, setBoard, currentPosition, setPosition, sendMove}) {
    const files = ["a", "b", "c", "d", "e", "f", "g", "h"];
    const ranks = [8, 7, 6, 5, 4, 3, 2, 1];

    function getSquareClass(square) {
        let curFile = square.charAt(0).charCodeAt() - "a".charCodeAt();
        let curRank = square.charAt(1) - "1";
        return ((curFile + curRank) % 2 === 0 ? "square-light" : "square-dark");
    }

    const board = [];

    for (let i = 0; i < 8; i++) {
        board[i] = [];
        for (let j = 0; j < 8; j++) {
            board[i][j] = (
                <div
                    key={ranks[i].toString() + files[j]} 
                    className={getSquareClass(boardArray[i][j])} 
                    id={boardArray[i][j]+`-square`}
                >
                </div>
            );
        }
    }

    return (
        <div className="board">
            <div className="squares">{board}</div>
            <Pieces boardArray={boardArray} currentPosition={currentPosition} setPosition={setPosition} sendMove={sendMove}/>
        </div>
    )
}

export default Board;