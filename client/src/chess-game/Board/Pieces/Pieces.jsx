import './Pieces.css'
import Piece from './Piece'
import { initialPosition, makeNewPosition } from './Position'
import { useState } from 'react'
import { useRef  } from 'react'

function Pieces() {
    const ref = useRef();
    const [currentPosition, setState] = useState(initialPosition());

    function dropSquare(e) {
        // Get and initialize x-pos of left side, and y-pos of bottom side of board
        const {width, bottom, left} = ref.current.getBoundingClientRect();
        const x0 = left;
        const y0 = bottom;
        const scale = width/8;

        // Get x-pos and y-pos of where the piece was dropped
        const x = e.clientX;
        const y = e.clientY;
        
        // Calculate and return the new file + rank
        const newFile = String.fromCharCode(97 + Math.floor((x - x0)/scale));
        const newRank = Math.floor(-1*(y - y0)/scale) + 1;
        return {newFile, newRank};
    }

    function onDrop(e) {
        const [type, file, rank] = e.dataTransfer.getData('text').split('-');
        const {newFile, newRank} = dropSquare(e);

        // Make a new position, only changing the position of the piece that was moved
        const nextPosition = makeNewPosition(currentPosition, type, file, rank, newFile, newRank);

        // Make the new position the current one
        setState(nextPosition);
    }

    function onDragOver(e) {
        e.preventDefault();
    }

    let pieces = (
        currentPosition.map((rank, r) => 
            rank.map((file, f) => {
                if (currentPosition[r][f] !== '') return <Piece key={f+r} type={currentPosition[r][f]} rank={8-r} file={f}/>;
                else return null;
            })
        )
    );

    return <div ref = {ref} onDrop={onDrop} onDragOver={onDragOver} className='pieces'>{pieces}</div>
}

export default Pieces;