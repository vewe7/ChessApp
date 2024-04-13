import "./Panel.css"

import Timer from "./Timer.jsx"
import Buttons from "./Buttons.jsx"

function Panel({ whiteTime, blackTime }) {
    return (
        <div className="panel">
            <Timer color={"black"} time={blackTime}/>
            <Buttons/>
            <Timer color={"white"} time={whiteTime}/>
        </div>
    )
}

export default Panel;