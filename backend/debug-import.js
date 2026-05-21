require('dotenv').config();
console.log('SUPABASE_URL:', process.env.SUPABASE_URL ? 'Cargado' : 'NO CARGADO');
console.log('SUPABASE_ANON_KEY:', process.env.SUPABASE_ANON_KEY ? 'Cargado' : 'NO CARGADO');

try {
  console.log('Importando db.js...');
  const pool = require('./src/config/db');
  console.log('✅ db.js importado exitosamente');
  console.log('pool:', typeof pool);
  console.log('pool.query:', typeof pool.query);
} catch (err) {
  console.error('❌ Error al importar db.js:', err.message);
  console.error(err.stack);
}
