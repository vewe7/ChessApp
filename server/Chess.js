class Chess {
    constructor (whiteId, blackId) {
        this.whiteId = whiteId;
        this.blackId = blackId;
        this.gameFinished = false;
    }

    // Return false for an invalid move. Otherwise, update board state and return true. 
    makeMove(move) {
        return { valid: true, result: null }; // placeholder, implement later
    }   

    getPGN() {
        return "placeholder";
    }
}

module.exports = Chess;