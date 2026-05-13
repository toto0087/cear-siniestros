const router = require('express').Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');

// POST /api/auth/login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: 'Usuario y contraseña requeridos' });
  }

  const [rows] = await pool.query(
    'SELECT * FROM usuarios WHERE username = ? AND activo = 1',
    [username]
  );
  const user = rows[0];
  if (!user) return res.status(401).json({ message: 'Credenciales incorrectas' });

  const match = await bcrypt.compare(password, user.password_hash);
  if (!match) return res.status(401).json({ message: 'Credenciales incorrectas' });

  const token = jwt.sign(
    { id: user.id, username: user.username, rol: user.rol, nombre: user.nombre, apellido: user.apellido },
    process.env.JWT_SECRET,
    { expiresIn: '8h' }
  );

  res.json({
    token,
    user: { id: user.id, nombre: user.nombre, apellido: user.apellido, rol: user.rol, username: user.username },
  });
});

module.exports = router;
