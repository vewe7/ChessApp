const db = require("../db-access");
const { Chess } = require('chess.js');

const matches = new Map();
let matchIterator = 1; // Should probably make a better id generator

async function saveGame(matchId) {
    const match = matches.get(matchId);
    const pgn = match.getPGN();
    const whiteId = match.whiteId;
    const blackId = match.blackId;
    return await db.saveGame(whiteId, blackId, pgn);
}

async function endGame(matchId) {
    if (await saveGame(matchId) == false) 
        console.log("Error saving game");
    matches.delete(matchId);
}
  
function initializeMatchHandlers(io, socket, socketUser) {
    // MATCH EVENTS ================
    socket.on("makeMove", async (matchId, move) => {
        try {
            // Make sure match exists
            const match = matches.get(matchId);
            if (match == undefined) {
                socket.emit("makeMove", "Match id not found");
                return;
            }

            let newStatus = "none";
            match.move(move);

            // Check if move caused game state to change
            if (match.isGameOver()) {
                if (match.isCheckmate()) 
                    newStatus = "checkmate";
                if (match.isDraw()) 
                    newStatus = "draw";
                if (match.isStalemate())
                    newStatus = "stalemate";
                if (match.isThreefoldRepetition())
                    newStatus = "threefold";
                endGame(matchId);
            } else if (match.inCheck()) {
                newStatus = "check";
            }
            io.to(`match:${matchId}`).emit("validMove", move, newStatus);
        } catch (error) {
            socket.emit("makeMove", "Invalid move");
        }
    });

    socket.on("resign", async (matchId) => {
        // Make sure match exists
        const match = matches.get(matchId);
        if (match == undefined) {
            socket.emit("makeMove", "Match id not found");
            return;
        }

        // Determine color of resigning player and emit
        const color = (socketUser.id == match.whiteId) ? "w" : "b";
        io.to(`match:${matchId}`).emit("resign", color);
        
        // Save result to pgn
        const result = (color == "w") ? "1-0" : "0-1";
        match.setComment(result);
        match.header("Result", result);

        endGame(matchId);
    });

    socket.on("offerDraw", async (matchId) => {
        // Make sure match exists
        const match = matches.get(matchId);
        if (match == undefined) {
            return;
        }

        // Determine id of the player being offered a draw
        const opponentId = (socketUser.id == match.whiteId) ? match.blackId : match.whiteId;
        io.to(`user:${opponentId}`).emit("offerDraw");
    });

    // need separate event for "accept draw"
};

module.exports = {
    initializeMatchHandlers: initializeMatchHandlers,
    matches: matches,
    matchIterator: matchIterator 
};