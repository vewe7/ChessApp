export function initialPosition() {
    const position = new Array(8).fill('').map(x => new Array(8).fill(''));

    // Black Pieces
    position[0][0] = position[0][7] = 'br'; // Rooks
    position[0][1] = position[0][6] = 'bn'; // Knights
    position[0][2] = position[0][5] = 'bb'; // Bishops
    position[0][3] = 'bq'; // Queen
    position[0][4] = 'bk'; // King

    // Pawns
    for (let i = 0; i < 8; i++) {
        position[1][i] = 'bp'; // Black
        position[6][i] = 'wp'; // White
    }

    // White Pieces
    position[7][0] = position[7][7] = 'wr'; // Rooks
    position[7][1] = position[7][6] = 'wn'; // Knights
    position[7][2] = position[7][5] = 'wb'; // Bishops
    position[7][3] = 'wq'; // Queen
    position[7][4] = 'wk'; // King

    return position;
}

export function makeNewPosition(position, type, f0, r0, f1, r1, board) {
    const position2 = [...position];

    const isUnflipped = (board[0][0] === "a8" ? true : false); // White POV === False
    
    function convertFile(f, isUnflipped) {
        let curFile = f.charCodeAt(0) - 'a'.charCodeAt(0);
        return (isUnflipped ? curFile : 7 - curFile);
    }

    function convertRank(r, isUnflipped) {
        let curRank = 8 - r;
        return (isUnflipped ? curRank : 7 - curRank);
    }

    // Convert conventional file/rank notation to array indexes
    f0 = convertFile(f0, isUnflipped);
    f1 = convertFile(f1, isUnflipped);
    r0 = convertRank(r0, isUnflipped);
    r1 = convertRank(r1, isUnflipped);

    // Check castle
    if (type.charAt(1) == 'k' && Math.abs(f1 - f0) == 2) {
        if (isUnflipped) {
            // Kingside
            if (f1 > f0) {
                position2[r0][7] = '';
                position2[r0][5] = type.substring(0, 1) + "r";
            }
            // Queenside
            else {
                position2[r0][0] = '';
                position2[r0][3] = type.substring(0, 1) + "r";
            }
        }

        else {
            // Queenside
            if (f1 > f0) {
                position2[r0][7] = '';
                position2[r0][4] = type.substring(0, 1) + "r";
            }
            // Kingside
            else {
                position2[r0][0] = '';
                position2[r0][2] = type.substring(0, 1) + "r";
            }
        }
    }

    // Check en passant
    else if (type.charAt(1) == 'p' && f0 != f1 && position[r1][f1] == '') {
        position2[r0][f1] = '';
    }

    const isPromotion = (type.charAt(1) === 'p' && (r1 === 0 || r1 === 7)) ? true : false;

    position2[r0][f0] = '';
    position2[r1][f1] = isPromotion ? type.substring(0, 1) + "q" : type;

    return position2;
}

export function flipPosition(currentPosition, setPosition) {
    const newPosition = [];

    for (let i = 0; i < 8; i++) {
        newPosition[i] = [];
        for (let j = 0; j < 8; j++) {
            newPosition[i][j] = currentPosition[7-i][7-j];
        }
    }

    setPosition(newPosition);
}