const pool = require('../config/database');

const getAllDevices = async () => {
    const [rows] = await pool.query('SELECT * FROM devices');
    return rows;
};

const getDeviceById = async (id) => {
    const [rows] = await pool.query('SELECT * FROM devices WHERE id = ?', [id]);
    return rows[0];
};

const createDevice = async (name, description, functionality) => {
    const [result] = await pool.query('INSERT INTO devices (name, description, functionality) VALUES (?, ?, ?)', [name, description, functionality]);
    return { id: result.insertId, name, description, functionality };
};

const updateDevice = async (id, name, description, functionality) => {
    const [result] = await pool.query('UPDATE devices SET name = ?, description = ?, functionality = ? WHERE id = ?', [name, description, functionality, id]);
    return result.affectedRows > 0 ? { id, name, description, functionality } : null;
};

const deleteDevice = async (id) => {
    const [result] = await pool.query('DELETE FROM devices WHERE id = ?', [id]);
    return result.affectedRows > 0;
};

module.exports = {
    getAllDevices,
    getDeviceById,
    createDevice,
    updateDevice,
    deleteDevice
};