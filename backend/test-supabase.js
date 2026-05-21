const pool = require('./src/config/db');

async function testConnection() {
  try {
    console.log('Intentando conexión a Supabase...');
    const [data] = await pool.query('SELECT * FROM usuarios LIMIT 1');
    
    console.log('✅ Conexión exitosa a Supabase');
    console.log('Usuarios encontrados:', data?.length || 0);
    if (data?.length > 0) {
      console.log('Primer usuario:', data[0]);
    }
  } catch (err) {
    console.error('❌ Error:', err.message);
  }
  process.exit(0);
}

testConnection();

