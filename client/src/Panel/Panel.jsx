import "./Panel.css"
import Timer from "./Timer.jsx"
import Buttons from "./Buttons.jsx"

function Panel({ bottomTime, setBottomTime, topTime, setTopTime, boardArray, setBoard, currentPosition, setPosition , ranks, setRanks, files, setFiles }) {
    return (
        <div className="panel">
            <Timer color={"black"} time={topTime}/>
            <Buttons 
                bottomTime={bottomTime} 
                setBottomTime={setBottomTime} 
                topTime={topTime} 
                setTopTime={setTopTime} 
                boardArray={boardArray} 
                setBoard={setBoard} 
                currentPosition={currentPosition} 
                setPosition={setPosition} 
                ranks={ranks} 
                setRanks={setRanks} 
                files={files} 
                setFiles={setFiles}
            />
            <Timer color={"white"} time={bottomTime}/>
        </div>
    )
}

export default Panel;