const db = require("../db-access");
const { Chess } = require('chess.js');

const matches = new Map();
let matchIterator = 1;

function startMatch(whiteUsername, blackUsername) {
    const chess = new Chess();
    chess.header("White", whiteUsername, "Black", blackUsername);

    const date = new Date();
    chess.header("Date", `${date.getMonth()}-${date.getDate()}-${date.getFullYear()}`);

    return chess;
}

async function saveGame(matchId) {
    const match = matches.get(matchId);
    const pgn = match.getPGN();
    const whiteId = match.whiteId;
    const blackId = match.blackId;
    // return await db.saveGame(whiteId, blackId, pgn);
}

async function endGame(matchId) {
    if (await saveGame(matchId) == false) 
        console.log("Error saving game");
    matches.delete(matchId);
}
  
module.exports = (io, socket, socketUser) => {
    // MATCH EVENTS ================
    socket.on("makeMove", async (matchId, move) => {
        try {
            let newStatus = "none";
            chess.move(move);

            // Check if move caused game state to change
            if (chess.isGameOver()) {
            if (chess.isCheckmate()) 
                newStatus = "checkmate";
            if (chess.isDraw()) 
                newStatus = "draw";
            if (chess.isStalemate())
                newStatus = "stalemate";
            if (chess.isThreefoldRepetition())
                newStatus = "threefold";

            endGame(matchId);
            } else if (chess.in_check()) {
            newStatus = "check";
            }

            io.to(`match:${matchId}`).emit("validMove", move, newStatus);
        } catch (error) {
            socket.emit("makeMove", "Invalid move");
        }
    });
};