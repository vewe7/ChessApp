const db = require("../db-access");
const { Chess } = require("chess.js");

const matches = new Map();
let matchIterator = 1; // Should probably make a better id generator

async function saveGame(match) {
    const pgn = match.chess.pgn();
    const whiteId = match.whiteId;
    const blackId = match.blackId;
    return await db.saveGame(whiteId, blackId, pgn);
}

async function endGame(io, matchId, status, winner) {
    const match = matches.get(matchId);
    if (match == undefined)
        return;

    match.over = true;
    match.live = false;
    stopMatchClock(match);

    io.to(`match:${matchId}`).emit("gameOver", status, winner);

    if (await saveGame(match) == false) 
        console.log("Error saving game");
    matches.delete(matchId);
}

// End game, where [color] loses on time
async function endGameOnFlag(io, matchId, color) {
    const match = matches.get(matchId);
    if (match == undefined)
        return;

    const result = (color == "w") ? "0-1" : "1-0";
    match.chess.setComment((color == "b" ? "White" : "Black") + "wins on time.");
    match.chess.setComment(result);
    match.chess.header("Result", result);

    endGame(io, socket, matchId, "flag", (color == "w" ? "b" : "w"));
}

async function endGameOnDraw(io, matchId, status="draw") {
    const match = matches.get(matchId);
    if (match == undefined)
        return;

    match.chess.setComment("1/2-1/2");
    match.chess.header("Result", "1/2-1/2");
    endGame(io, matchId, "draw", "draw");
}

// End game, where [color] resigns
async function endGameOnResign(io, matchId, color) {
    const match = matches.get(matchId);
    if (match == undefined)
        return;

    const result = (color == "w") ? "0-1" : "1-0";
    match.chess.setComment((color == "w" ? "White" : "Black") + "resigns.");
    match.chess.setComment(result);
    match.chess.header("Result", result);
    endGame(io, matchId, "resign", color);
}

function updateActiveClock(match, matchId, io, rate) {
    let activeClock = match.chess.turn() == "w" ? match.clock.white : match.clock.black;

    activeClock.remainingTime -= rate;

    if (activeClock.remainingTime < 50) {
        io.to(`match:${matchId}`).emit("updateClock", match.chess.turn(), 0);
        endGameOnFlag(io, matchId, match.chess.turn());
    };
}

function pollClocks(match, matchId, io) {
    const turn = match.chess.turn();
    const clock = turn == "w" ? match.clock.white : match.clock.black;
    io.to(`match:${matchId}`).emit("updateClock", turn, clock.remainingTime);
    console.log("clocks polled");
}

function startMatchClock(matchId, io) {
    const match = matches.get(matchId);
    if (match == undefined || match.live || match.over)
        return;

    match.live = true;
    console.log("Starting match clock for match " + matchId);

    io.to(`match:${matchId}`).emit("updateClock", "b", match.clock.black.remainingTime);
    io.to(`match:${matchId}`).emit("updateClock", "w", match.clock.white.remainingTime);

    match.clock.clockInterval = setInterval(() => { 
        updateActiveClock(match, matchId, io, 10);
    }, 10);

    match.clock.pollInterval = setInterval(() => {
        pollClocks(match, matchId, io);
    }, 50);
}

function stopMatchClock(match) {
    clearInterval(match.clock.clockInterval);
    clearInterval(match.clock.pollInterval);
}

// Check if the socket's user is a valid player in the match
function isSocketMatchParticipant(match, socketUser) {
    return (socketUser.id == match.whiteId || socketUser.id == match.blackId);
}
  
function initializeMatchHandlers(io, socket, socketUser) {
    socket.on("joinMatchRoom", async (matchId) => {
        if (socket.rooms.has(`match:${matchId}`))
            return;
        const match = matches.get(matchId);
        if (match == undefined) {
            socket.emit("joinMatchRoom", "Match id not found");
            return;
        };
        if (!isSocketMatchParticipant(match, socketUser)) {
            socket.emit("joinMatchRoom", "Invalid user for this match");
            return;
        }

        socket.join(`match:${matchId}`);

        // Start clock when both players have joined
        const matchSockets = await io.in(`match:${matchId}`).fetchSockets();
        console.log("Match sockets: " + matchSockets.length);
        if (matchSockets.length > 1 && !match.live) {
            startMatchClock(matchId, io);
        }
    });

    socket.on("leaveMatchRoom", (matchId) => {
        socket.leave(`match:${matchId}`);
    });
    
    // MATCH EVENTS ================
    socket.on("makeMove", async (matchId, move) => { // move has form {from: "e2", to: "e4"}
        try {
            if (move.promotion == "")
                delete move.promotion;

            // Make sure match exists
            const match = matches.get(matchId);
            if (match == undefined) {
                socket.emit("moveError", "Match id not found");
                return;
            } else if (!match.live) {
                socket.emit("moveError", "Match has ended");
                return;
            }

            if (!isSocketMatchParticipant(match, socketUser)) {
                socket.emit("moveError", "Invalid user for this match");
                return;
            }
            
            const chess = match.chess;

            // Prevent player from moving for opponent
            const turn = chess.turn()
            if (turn == 'w' && socketUser.id == match.blackId || 
                turn == 'b' && socketUser.id == match.whiteId) {
                socket.emit("moveError", "Not your turn");
                return;
            } 

            let newStatus = "none";
            chess.move(move); // Anything below this line should only run on valid move 
            
            match.drawState.whiteOffer = false; 
            match.drawState.blackOffer = false;

            // Check if move caused game state to change
            if (chess.isGameOver()) {
                if (chess.isCheckmate()) {
                    newStatus = "checkmate";
                    chess.header("Result", (turn == "w" ? "1-0" : "0-1"));
                    endGame(io, matchId, "checkmate", turn);
                } else if (chess.isDraw()) {
                    newStatus = "draw";
                    endGameOnDraw(io, matchId, "draw")
                } else if (chess.isStalemate()) {
                    newStatus = "stalemate";
                    endGameOnDraw(io, matchId, "stalemate");
                } else if (chess.isThreefoldRepetition()) {
                    newStatus = "threefold";
                    endGameOnDraw(io, matchId, "threefold");
                } else { // Insufficient material
                    newStatus = "insufficient";
                    endGameOnDraw(io, matchId, "insufficient");
                }
            } else if (chess.inCheck()) {
                newStatus = "check";
            }

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
            socket.emit("resign", "Match id not found");
            return;
        }
        if (!isSocketMatchParticipant(match, socketUser)) {
            socket.emit("moveError", "Invalid user for this match");
            return;
        }

        // Determine color of resigning player and emit
        const color = (socketUser.id == match.whiteId) ? "w" : "b";
        io.to(`match:${matchId}`).emit("resign", color);
        
        endGameOnResign(io, matchId, color);
    });

    socket.on("offerDraw", (matchId) => {
        // Make sure match exists
        const match = matches.get(matchId);
        if (match == undefined) {
            socket.emit("offerDraw", "Match id not found");
            return;
        }
        if (!isSocketMatchParticipant(match, socketUser)) {
            socket.emit("moveError", "Invalid user for this match");
            return;
        }

        const color = (socketUser.id == match.whiteId) ? "w" : "b";
        if (color == "w") 
            match.drawState.whiteOffer = true;
        else 
            match.drawState.blackOffer = true;

        if (match.drawState.whiteOffer && match.drawState.blackOffer) {
            // Both players have agreed to draw
            endGameOnDraw(io, matchId);
            io.to(`match:${matchId}`).emit("acceptDraw");
        } else {
            // Emit draw offer to opponent
            const opponentId = (color == "w") ? match.blackId : match.whiteId;
            io.to(`user:${opponentId}`).emit("offerDraw");
        }        
    });

    socket.on("declineDraw", (matchId) => {
        // Make sure match exists
        const match = matches.get(matchId);
        if (match == undefined) {
            socket.emit("declineDraw", "Match id not found");
            return;
        }
        if (!isSocketMatchParticipant(match, socketUser)) {
            socket.emit("moveError", "Invalid user for this match");
            return;
        }

        match.drawState.whiteOffer = false;
        match.drawState.blackOffer = false;

        io.to(`match:${matchId}`).emit("declineDraw");
    });
};

module.exports = {
    initializeMatchHandlers: initializeMatchHandlers,
    matches: matches,
    matchIterator: matchIterator 
};