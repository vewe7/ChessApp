export function initialBoard() {
    const boardArray = [];
    
    for (let i = 0; i < 8; i++) {
        boardArray[i] = [];
        for (let j = 0; j < 8; j++) {
            boardArray[i][j] = String.fromCharCode(97+j) + (8-i).toString();
        }
    }

    return boardArray;
}

export function flipBoard(boardArray) {
    const newBoardArray = [];

    for (let i = 0; i < 8; i++) {
        newBoardArray[i] = [];
        for (let j = 0; j < 8; j++) {
            newBoardArray[i][j] = boardArray[7-i][7-j];
        }
    }

    return newBoardArray;
}