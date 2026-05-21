console.log('Iniciando test...');
try {
  console.log('Requiriendo pool...');
  const pool = require('./src/config/db');
  console.log('Pool requerido exitosamente');
  console.log(typeof pool);
} catch (err) {
  console.error('Error al requerir:', err.message);
}
