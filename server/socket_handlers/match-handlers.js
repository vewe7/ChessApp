const db = require("../db-access");
const { Chess } = require("chess.js");

const matches = new Map();
let matchIterator = 1; // Should probably make a better id generator

async function saveGame(matchId) {
    const match = matches.get(matchId);
    const pgn = match.chess.pgn(); // TO-DO: add username headers to pgn
    console.log(pgn); // DEBUG
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
    socket.on("joinMatchRoom", (matchId) => {
        console.log("User id " + socketUser.id + " joined match room: " + matchId);
        socket.join(`match:${matchId}`);
    });

    socket.on("leaveMatchRoom", (matchId) => {
        socket.leave(`match:${matchId}`);
    });
    
    // MATCH EVENTS ================
    socket.on("makeMove", async (matchId, move) => { // move has form {from: "e2", to: "e4"}
        try {
            console.log("Move received from matchId: " + matchId);
            console.log(move);

            // Make sure match exists
            matchId = parseInt(matchId);
            const match = matches.get(matchId);
            if (match == undefined) {
                socket.emit("moveError", "Match id not found");
                return;
            }
            const chess = match.chess;

            // Prevent player from moving for opponent
            const turn = chess.turn()
            if (turn == 'w' && socketUser.id == match.blackId) {
                socket.emit("moveError", "Not your turn");
                return;
            } 
            if (turn == 'b' && socketUser.id == match.whiteId) {
                socket.emit("moveError", "Not your turn");
                return;
            }

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
            } else if (chess.inCheck()) {
                newStatus = "check";
            }

            console.log("Emitting validMove now");
            io.to(`match:${matchId}`).emit("validMove", move, newStatus);
        } catch (error) {
            console.log(error);
            socket.emit("moveError", "Invalid move");
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