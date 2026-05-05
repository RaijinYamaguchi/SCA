const pool = require('../config/database');

const createMeter = async (userId, name, location) => {
  const [result] = await pool.query(
    'INSERT INTO meters (user_id, name, location) VALUES (?, ?, ?)',
    [userId, name, location]
  );
  return result.insertId;
};

const getUserMeters = async (userId) => {
  const [rows] = await pool.query(
    'SELECT * FROM meters WHERE user_id = ? ORDER BY created_at DESC',
    [userId]
  );
  return rows;
};

const getMeterById = async (id) => {
  const [rows] = await pool.query(
    'SELECT * FROM meters WHERE id = ?',
    [id]
  );
  return rows[0] || null;
};

const updateMeter = async (id, name, location) => {
  const [result] = await pool.query(
    'UPDATE meters SET name = ?, location = ? WHERE id = ?',
    [name, location, id]
  );
  return result.affectedRows > 0;
};

const deleteMeter = async (id) => {
  const [result] = await pool.query(
    'DELETE FROM meters WHERE id = ?',
    [id]
  );
  return result.affectedRows > 0;
};

module.exports = {
  createMeter,
  getUserMeters,
  getMeterById,
  updateMeter,
  deleteMeter
};
