import React, { useState } from "react";
import "./App.css";

import './Game.css'
import Files from './Border/Files'
import Ranks from './Border/Ranks'
import Board from './Board/Board'

function Game() {
    const ranks = [8, 7, 6, 5, 4, 3, 2, 1];
    const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];

    return (
        <div className='game'>
            <Ranks ranks={ranks}/>
            <Board/>
            <Files files={files}/>
        </div>
    )
}

export default Game;