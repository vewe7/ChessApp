import "./Buttons.css"
import { flipAll } from "./ButtonFunctions.jsx"

function Buttons({bottomTime, setBottomTime, topTime, setTopTime, boardArray, setBoard, currentPosition, setPosition, ranks, setRanks, files, setFiles, bottomName, setBottomName, topName, setTopName, sendDrawOffer, sendResignation}) {
    return (
        <div className="buttons">
            <button className="panel-button" id="flip" onClick={() => flipAll(bottomTime, setBottomTime, topTime, setTopTime, boardArray, setBoard, currentPosition, setPosition, ranks, setRanks, files, setFiles, bottomName, setBottomName, topName, setTopName)}>⇵</button>
            <button className="panel-button" id="draw" onClick={() => sendDrawOffer()}>½</button>
            <button className="panel-button" id="resign" onClick={() => sendResignation()}>⚑</button>
        </div>
    )
}

export default Buttons;