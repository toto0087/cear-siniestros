const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Token requerido' });
  }
  const token = header.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    return res.status(401).json({ message: 'Token inválido o expirado' });
  }
};

const adminOnly = (req, res, next) => {
  if (req.user?.rol !== 'admin') {
    return res.status(403).json({ message: 'Acceso denegado: solo administradores' });
  }
  next();
};

module.exports = { authMiddleware, adminOnly };
