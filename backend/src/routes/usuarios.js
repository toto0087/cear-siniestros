const router = require('express').Router();
const bcrypt = require('bcrypt');
const pool = require('../config/db');
const { authMiddleware, adminOnly } = require('../middleware/auth');

router.use(authMiddleware, adminOnly);

// GET /api/usuarios  — lista todos los clientes
router.get('/', async (req, res) => {
  const [rows] = await pool.query(
    `SELECT id, nombre, apellido, cuil, direccion, email, username, activo, created_at
     FROM usuarios WHERE rol = 'cliente' ORDER BY apellido, nombre`
  );
  res.json(rows);
});

// GET /api/usuarios/:id
router.get('/:id', async (req, res) => {
  const [rows] = await pool.query(
    `SELECT id, nombre, apellido, cuil, direccion, email, username, activo, created_at
     FROM usuarios WHERE id = ? AND rol = 'cliente'`,
    [req.params.id]
  );
  if (!rows[0]) return res.status(404).json({ message: 'Cliente no encontrado' });
  res.json(rows[0]);
});

// POST /api/usuarios  — crear cliente
router.post('/', async (req, res) => {
  const { nombre, apellido, cuil, direccion, email, username, password } = req.body;
  if (!nombre || !apellido || !username || !password) {
    return res.status(400).json({ message: 'Nombre, apellido, usuario y contraseña son requeridos' });
  }
  const hash = await bcrypt.hash(password, 10);
  const [result] = await pool.query(
    `INSERT INTO usuarios (nombre, apellido, cuil, direccion, email, username, password_hash, rol)
     VALUES (?, ?, ?, ?, ?, ?, ?, 'cliente')`,
    [nombre, apellido, cuil || null, direccion || null, email || null, username, hash]
  );
  res.status(201).json({ id: result.insertId, message: 'Cliente creado exitosamente' });
});

// PUT /api/usuarios/:id  — editar cliente
router.put('/:id', async (req, res) => {
  const { nombre, apellido, cuil, direccion, email, username, password, activo } = req.body;
  const fields = [];
  const values = [];

  if (nombre !== undefined)    { fields.push('nombre = ?');    values.push(nombre); }
  if (apellido !== undefined)  { fields.push('apellido = ?');  values.push(apellido); }
  if (cuil !== undefined)      { fields.push('cuil = ?');      values.push(cuil); }
  if (direccion !== undefined) { fields.push('direccion = ?'); values.push(direccion); }
  if (email !== undefined)     { fields.push('email = ?');     values.push(email); }
  if (username !== undefined)  { fields.push('username = ?');  values.push(username); }
  if (activo !== undefined)    { fields.push('activo = ?');    values.push(activo ? 1 : 0); }
  if (password)                { fields.push('password_hash = ?'); values.push(await bcrypt.hash(password, 10)); }

  if (!fields.length) return res.status(400).json({ message: 'Nada que actualizar' });

  values.push(req.params.id);
  await pool.query(`UPDATE usuarios SET ${fields.join(', ')} WHERE id = ? AND rol = 'cliente'`, values);
  res.json({ message: 'Cliente actualizado' });
});

// DELETE /api/usuarios/:id  — desactivar (soft delete)
router.delete('/:id', async (req, res) => {
  await pool.query(`UPDATE usuarios SET activo = 0 WHERE id = ? AND rol = 'cliente'`, [req.params.id]);
  res.json({ message: 'Cliente desactivado' });
});

module.exports = router;
