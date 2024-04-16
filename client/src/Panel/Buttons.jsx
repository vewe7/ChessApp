import "./Buttons.css"
import { flipAll } from "./ButtonFunctions.jsx"

function Buttons({boardArray, setBoard, currentPosition, setPosition, ranks, setRanks, files, setFiles}) {
    return (
        <div className="buttons">
            <button className="panel-button" id="flip" onClick={() => flipAll(boardArray, setBoard, currentPosition, setPosition, ranks, setRanks, files, setFiles)}>⇵</button>
            <button className="panel-button" id="draw">½</button>
            <button className="panel-button" id="resign">⚑</button>
        </div>
    )
}

export default Buttons;