const pool = require("./db");

async function getIdByUsername(username) {
    const query = await pool.query("SELECT * FROM player WHERE username = $1", [username]);
    // Username not found
    if(query.rows.length == 0)
        return null;
    return query.rows[0].user_id;
}

async function getUsernameById(id) {
    const query = await pool.query("SELECT * FROM player WHERE user_id = $1", [id]);
    // Username not found
    if(query.rows.length == 0)
        return null;
    return query.rows[0].username;
}

async function getUserById(id) {
    const query = await pool.query("SELECT * FROM player WHERE user_id = $1", [id]);
    // Username not found
    if(query.rows.length == 0)
        return null;
    return { username: query.rows[0].username, id: query.rows[0].user_id};
}

async function getUserByUsername(username) {
    const query = await pool.query("SELECT * FROM player WHERE username = $1", [username]);
    // Username not found
    if(query.rows.length == 0)
        return null;
    return { username: query.rows[0].username, id: query.rows[0].user_id};
}

// Save game to database
async function saveGame(whiteId, blackId, pgn) {
    // return true if query successful
    try {
        const matchesQuery = "INSERT INTO matches (white_id, black_id, pgn) VALUES ($1, $2, $3) RETURNING *";

        const matchesResult = await pool.query(matchesQuery, [whiteId, blackId, pgn]);
        if (matchesResult.rowCount !== 1 ) {
            console.error("Game failed to save!");
            return false;
        }

        const newMatch = matchesResult.rows[0];
        const playerMatchesQuery = "INSERT INTO player_matches (user_id, match_id) VALUES ($1, $2)  RETURNING *";

        const playerMatchesResult1 = await pool.query(playerMatchesQuery, [whiteId, newMatch.match_id]);
        if (playerMatchesResult1.rowCount !== 1 ) {
            console.error("Game failed to save!");
            return false;
        }

        const playerMatchesResult2 = await pool.query(playerMatchesQuery, [blackId, newMatch.match_id]);
        if (playerMatchesResult2.rowCount !== 1 ) {
            console.error("Game failed to save!");
            return false;
        }
        
        return true;
    } catch (error) {
        console.error('saveGame() threw an exception:', error);
        return false;
    }
}

module.exports = {
    getIdByUsername,
    getUsernameById,
    getUserById,
    getUserByUsername,
    saveGame
};