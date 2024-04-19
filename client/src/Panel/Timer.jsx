import "./Timer.css"

function Timer({ color, time }) {
    // Convert milliseconds to string with format "MM:SS.d" 
    function msToTimeString(milliseconds) {
        const totalSeconds = Math.floor(milliseconds / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        const deciseconds = Math.floor(milliseconds / 100);
    
        const formattedMinutes = String(minutes).padStart(2, "0");
        const formattedSeconds = String(seconds).padStart(2, "0");
        const formattedDeciseconds = String(deciseconds % 10);
        
        return `${formattedMinutes}:${formattedSeconds}.${formattedDeciseconds}`;
    }

    const ID = color + "-timer";

    return (
        <div className="timer" id={ID}>{msToTimeString(time)}</div>
    )
}

export default Timer;