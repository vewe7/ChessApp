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

export function makeNewPosition(position, type, f0, r0, f1, r1) {
    const position2 = new Array(8).fill('').map(x => new Array(8).fill(''));

    function convertFile(f) {
        return (f.charCodeAt(0) - 'a'.charCodeAt(0));
    }

    function convertRank(r) {
        return (8 - r);
    }

    // Convert conventional file/rank notation to array indexes
    f0 = convertFile(f0);
    f1 = convertFile(f1);
    r0 = convertRank(r0);
    r1 = convertRank(r1);

    for (let r = 0; r < 8; r++) {
        for (let f = 0; f < 8; f++) {
            // Remove from initial square
            if (f === f0 && r === r0) {
                position2[r][f] = '';
            }

            // Add to destination square
            else if (f === f1 && r === r1) {
                position2[r][f] = type;
            }

            // Copy everything else
            else {
                position2[r][f] = position[r][f];
            }
        }
    }

    return position2;
}