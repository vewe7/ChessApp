import { flipBoard } from "../Board/FlipBoard.jsx"
import { flipPosition } from "../Board/Position.jsx"

export function flipAll(boardArray, setBoard, currentPosition, setPosition, ranks, setRanks, files, setFiles) {
    flipBoard(boardArray, setBoard);
    flipPosition(currentPosition, setPosition);
    setRanks(ranks.slice().reverse());
    setFiles(files.slice().reverse());
}