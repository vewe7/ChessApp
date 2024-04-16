import "./Panel.css"
import Timer from "./Timer.jsx"
import Buttons from "./Buttons.jsx"

function Panel({ whiteTime, blackTime, boardArray, setBoard, currentPosition, setPosition , ranks, setRanks, files, setFiles }) {
    return (
        <div className="panel">
            <Timer color={"black"} time={blackTime}/>
            <Buttons boardArray={boardArray} setBoard={setBoard} currentPosition={currentPosition} setPosition={setPosition} ranks={ranks} setRanks={setRanks} files={files} setFiles={setFiles}/>
            <Timer color={"white"} time={whiteTime}/>
        </div>
    )
}

export default Panel;