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

module.exports = {
    getIdByUsername,
    getUsernameById,
    getUserById,
    getUserByUsername
};