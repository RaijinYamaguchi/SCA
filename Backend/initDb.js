const pool = require('./config/database');
require('dotenv').config();

const initializeDatabase = async () => {
  try {
    const connection = await pool.getConnection();

    console.log('Creating usuarios table if not exists...');
    await connection.query(`
      CREATE TABLE IF NOT EXISTS usuarios (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(100),
        email VARCHAR(100) UNIQUE,
        password VARCHAR(255),
        role VARCHAR(50),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✓ Usuarios table ready');

    console.log('Creating meters table...');
    await connection.query(`
      CREATE TABLE IF NOT EXISTS meters (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        name VARCHAR(100),
        location VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES usuarios(id) ON DELETE CASCADE
      )
    `);
    console.log('✓ Meters table created');

    console.log('Creating readings table...');
    await connection.query(`
      CREATE TABLE IF NOT EXISTS readings (
        id INT AUTO_INCREMENT PRIMARY KEY,
        meter_id INT NOT NULL,
        value DECIMAL(10, 2),
        reading_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (meter_id) REFERENCES meters(id) ON DELETE CASCADE
      )
    `);
    console.log('✓ Readings table created');

    connection.release();
    console.log('\n✓ Database initialized successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error initializing database:', error.message);
    process.exit(1);
  }
};

initializeDatabase();

