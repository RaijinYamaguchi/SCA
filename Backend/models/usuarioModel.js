const pool = require('../config/database');

const getAllUsuarios = async () => {
    const [rows] = await pool.query('SELECT * FROM users');
    return rows;
};

const getUsuarioById = async (id) => {
    const [rows] = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
    return rows[0];
};

const createUsuario = async (username, email, password, role) => {
    const [result] = await pool.query('INSERT INTO users (username, password, email, role) VALUES (?, ?, ?, ?)', [username, password, email, role]);
    return { id: result.insertId, username, email };
};

const updateUsuario = async (id, username, email, password, role) => {
    const [result] = await pool.query('UPDATE users SET username = ?, password = ?, email = ?, role = ? WHERE id = ?', [username, password, email, role, id]);
    return result.affectedRows > 0 ? { id, username, email } : null;
};

const deleteUsuario = async (id) => {
    const [result] = await pool.query('DELETE FROM users WHERE id = ?', [id]);
    return result.affectedRows > 0;
};

module.exports = {
    getAllUsuarios,
    getUsuarioById,
    createUsuario,
    updateUsuario,
    deleteUsuario
};