const router = require('express').Router();
const pool = require('../config/db');
const { authMiddleware, adminOnly } = require('../middleware/auth');

// GET /api/polizas/mis-polizas  — para el cliente logueado
router.get('/mis-polizas', authMiddleware, async (req, res) => {
  const [polizas] = await pool.query(
    `SELECT p.*, GROUP_CONCAT(pt.patente) AS patentes
     FROM polizas p
     LEFT JOIN patentes pt ON pt.poliza_id = p.id
     WHERE p.usuario_id = ?
     GROUP BY p.id
     ORDER BY p.fecha_fin DESC`,
    [req.user.id]
  );
  res.json(polizas.map(p => ({
    ...p,
    patentes: p.patentes ? p.patentes.split(',') : [],
  })));
});

// --- Rutas solo admin ---
router.use(authMiddleware, adminOnly);

// GET /api/polizas/usuario/:usuarioId
router.get('/usuario/:usuarioId', async (req, res) => {
  const [polizas] = await pool.query(
    `SELECT p.*, GROUP_CONCAT(pt.patente) AS patentes
     FROM polizas p
     LEFT JOIN patentes pt ON pt.poliza_id = p.id
     WHERE p.usuario_id = ?
     GROUP BY p.id
     ORDER BY p.fecha_fin DESC`,
    [req.params.usuarioId]
  );
  res.json(polizas.map(p => ({
    ...p,
    patentes: p.patentes ? p.patentes.split(',') : [],
  })));
});

// POST /api/polizas  — crear póliza
router.post('/', async (req, res) => {
  const {
    usuario_id, numero_poliza, tipo, fecha_inicio, fecha_fin,
    cubre_incendio, cubre_cristales, cubre_rc, cubre_aviso_viaje,
    patentes,
  } = req.body;

  if (!usuario_id || !numero_poliza || !tipo || !fecha_inicio || !fecha_fin) {
    return res.status(400).json({ message: 'Faltan campos requeridos' });
  }

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    const [result] = await conn.query(
      `INSERT INTO polizas (usuario_id, numero_poliza, tipo, fecha_inicio, fecha_fin,
        cubre_incendio, cubre_cristales, cubre_rc, cubre_aviso_viaje)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        usuario_id, numero_poliza, tipo, fecha_inicio, fecha_fin,
        cubre_incendio ? 1 : 0, cubre_cristales ? 1 : 0,
        cubre_rc ? 1 : 0, cubre_aviso_viaje ? 1 : 0,
      ]
    );

    const polizaId = result.insertId;

    if (tipo === 'automotores' && Array.isArray(patentes) && patentes.length) {
      for (const pat of patentes.filter(p => p.trim())) {
        await conn.query('INSERT INTO patentes (poliza_id, patente) VALUES (?, ?)', [polizaId, pat.trim().toUpperCase()]);
      }
    }

    await conn.commit();
    res.status(201).json({ id: polizaId, message: 'Póliza creada exitosamente' });
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
});

// PUT /api/polizas/:id  — editar póliza
router.put('/:id', async (req, res) => {
  const {
    numero_poliza, fecha_inicio, fecha_fin,
    cubre_incendio, cubre_cristales, cubre_rc, cubre_aviso_viaje,
    patentes,
  } = req.body;

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    await conn.query(
      `UPDATE polizas SET numero_poliza=?, fecha_inicio=?, fecha_fin=?,
        cubre_incendio=?, cubre_cristales=?, cubre_rc=?, cubre_aviso_viaje=?
       WHERE id=?`,
      [
        numero_poliza, fecha_inicio, fecha_fin,
        cubre_incendio ? 1 : 0, cubre_cristales ? 1 : 0,
        cubre_rc ? 1 : 0, cubre_aviso_viaje ? 1 : 0,
        req.params.id,
      ]
    );

    const [[poliza]] = await conn.query('SELECT tipo FROM polizas WHERE id=?', [req.params.id]);
    if (poliza?.tipo === 'automotores' && Array.isArray(patentes)) {
      await conn.query('DELETE FROM patentes WHERE poliza_id=?', [req.params.id]);
      for (const pat of patentes.filter(p => p.trim())) {
        await conn.query('INSERT INTO patentes (poliza_id, patente) VALUES (?, ?)', [req.params.id, pat.trim().toUpperCase()]);
      }
    }

    await conn.commit();
    res.json({ message: 'Póliza actualizada' });
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
});

// DELETE /api/polizas/:id
router.delete('/:id', async (req, res) => {
  await pool.query('DELETE FROM polizas WHERE id=?', [req.params.id]);
  res.json({ message: 'Póliza eliminada' });
});

module.exports = router;
