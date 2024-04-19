import "./Panel.css"
import React, { useState } from "react";
import Timer from "./Timer.jsx"
import Buttons from "./Buttons.jsx"

function Panel({ bottomTime, setBottomTime, topTime, setTopTime, boardArray, setBoard, currentPosition, setPosition , ranks, setRanks, files, setFiles, sendDrawOffer, sendResignation }) {
    const [bottomName, setBottomName] = useState("You");
    const [topName, setTopName] = useState("Opponent");
    
    return (
        <div className="panel">
            <h2 className="username">{topName}</h2>
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
                bottomName={bottomName}
                setBottomName={setBottomName}
                topName={topName}
                setTopName={setTopName}
                sendDrawOffer={sendDrawOffer}
                sendResignation={sendResignation}
            />
            <Timer color={"white"} time={bottomTime}/>
            <h2 className="username">{bottomName}</h2>
        </div>
    )
}

export default Panel;