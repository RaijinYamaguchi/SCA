const { generateToken, hashPassword, comparePassword } = require('../config/auth');
const pool = require('../config/database');

const register = async (req, res) => {
  try {
    const { email, password, passwordConfirm } = req.body;

    if (!email || !password || !passwordConfirm) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    if (password !== passwordConfirm) {
      return res.status(400).json({ error: 'Passwords do not match' });
    }

    const [existingUser] = await pool.promise().query(
      'SELECT id FROM usuarios WHERE email = ?',
      [email]
    );

    if (existingUser.length > 0) {
      return res.status(409).json({ error: 'Email already registered' });
    }

    const hashedPassword = await hashPassword(password);

    const [result] = await pool.promise().query(
      'INSERT INTO usuarios (username, email, password, role) VALUES (?, ?, ?, ?)',
      [email.split('@')[0], email, hashedPassword, 'user']
    );

    const token = generateToken(result.insertId);
    res.status(201).json({
      message: 'User registered successfully',
      token,
      userId: result.insertId
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    const [users] = await pool.promise().query(
      'SELECT id, password FROM usuarios WHERE email = ?',
      [email]
    );

    if (users.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = users[0];
    const isPasswordValid = await comparePassword(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = generateToken(user.id);
    res.json({
      message: 'Login successful',
      token,
      userId: user.id
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const recoverPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email required' });
    }

    const [users] = await pool.promise().query(
      'SELECT id FROM usuarios WHERE email = ?',
      [email]
    );

    if (users.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const resetToken = generateToken(users[0].id);
    res.json({
      message: 'Password recovery token generated',
      resetToken
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  register,
  login,
  recoverPassword
};
