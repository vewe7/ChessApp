import Pieces from './Pieces'
import './Board.css'
import '../constants.css'
import { useEffect } from 'react';

function Board({matchId}) {
    const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
    const ranks = [8, 7, 6, 5, 4, 3, 2, 1];

    function getSquareClass(i, j) {
        return ((i + j) % 2 === 0 ? "square-light" : "square-dark");
    }

    const board = ranks.map((r, i) => files.map((f, j) => <div key={f+r} className={getSquareClass(i, j)}></div>));

    return (
        <div className='board'>
            <div className='squares'>{board}</div>
            <Pieces matchId={matchId}/>
        </div>
    )
}

export default Board;