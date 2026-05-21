require('dotenv').config();
const pool = require('./src/config/db');

async function testQuery() {
  try {
    console.log('Ejecutando query SELECT...');
    const [rows] = await pool.query(
      'SELECT * FROM usuarios WHERE username = ? AND activo = 1',
      ['admin']
    );
    console.log('✅ Query ejecutada');
    console.log('Rows:', rows);
    console.log('Primer row:', rows[0]);
  } catch (err) {
    console.error('❌ Error:', err.message);
    console.error('Stack:', err.stack);
  }
  process.exit(0);
}

testQuery();
