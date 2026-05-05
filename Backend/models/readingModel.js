const pool = require('../config/database');

const createReading = async (meterId, value, readingDate) => {
  const [result] = await pool.query(
    'INSERT INTO readings (meter_id, value, reading_date) VALUES (?, ?, ?)',
    [meterId, value, readingDate || new Date()]
  );
  return result.insertId;
};

const getMeterReadings = async (meterId) => {
  const [rows] = await pool.query(
    'SELECT * FROM readings WHERE meter_id = ? ORDER BY reading_date DESC',
    [meterId]
  );
  return rows;
};

const getMeterReadingsByPeriod = async (meterId, startDate, endDate) => {
  const [rows] = await pool.query(
    'SELECT * FROM readings WHERE meter_id = ? AND reading_date BETWEEN ? AND ? ORDER BY reading_date DESC',
    [meterId, startDate, endDate]
  );
  return rows;
};

const getLastReading = async (meterId) => {
  const [rows] = await pool.query(
    'SELECT * FROM readings WHERE meter_id = ? ORDER BY reading_date DESC LIMIT 1',
    [meterId]
  );
  return rows[0] || null;
};

module.exports = {
  createReading,
  getMeterReadings,
  getMeterReadingsByPeriod,
  getLastReading
};
