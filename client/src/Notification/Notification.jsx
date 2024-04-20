import "./Notification.css"

function Notification({type}) {
    function getMessage(type) {
        if (type === "draw-offer") return "You have been offered a draw.";
        else if (type === "draw-declined") return "The draw offer has been declined.";
        else if (type === "draw-sent") return "Your draw offer has been sent.";
        else return "";
    }

    const message = getMessage(String(type));

    return (
        <div className="notification">
            <div className="message">{message}</div>
        </div>
    )
}

export default Notification;