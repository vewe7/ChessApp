import './Piece.css'
import './Pieces.css'

// Generic class name: "piece {type} {initial-square}"
function Piece({type, rank, file}) {
    // Functions for handling the dragging/dropping
    const handleDrag = e => {
        e.dataTransfer.effectAllowed = 'move';
        setTimeout(() => {e.target.style.display = 'none';}, 0);
        e.dataTransfer.setData('text/plain', `${type}-${String.fromCharCode(97+file)}-${rank}`);
    }

    const handleDrop = e => {
        e.target.style.display = 'block';
    }

    // Returns how far to translate the piece given the destination rank & file
    function translateFile(file) {
        return 100*(file);
    }
    
    function translateRank(rank) {
        return 100*(8-rank);
    }

    return (
        <div 
            className={`piece ${type} ${String.fromCharCode(file+97)}${rank}`}
            style={{transform: `translate(${translateFile(file)}%, ${translateRank(rank)}%)`}}
            draggable={true}
            onDragStart={handleDrag}
            onDragEnd={handleDrop}
        />
    )
}

export default Piece;