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
    /*
    const query = "INSERT INTO match_history (white_id, black_id, pgn) VALUES ($1, $2, $3)";
    // return true if query successful
    try {
        const result = await pool.query(query, [whiteId, blackId, pgn]);

        if (result.rowCount === 1) 
            return true;

        console.error("Game failed to save!");
        return false;
    } catch (error) {
        console.error('saveGame() threw an exception:', error);
        return false;
    }
    */

    // PLACEHOLDER UNTIL DATABASE CONFIGURED
    return true;
}

module.exports = {
    getIdByUsername,
    getUsernameById,
    getUserById,
    getUserByUsername,
    saveGame
};