const path = require('path');
const envPath = path.resolve(__dirname, '.env');
console.log('Loading .env from:', envPath);

require('dotenv').config({ path: envPath });

console.log('=== ENVIRONMENT DEBUG ===');
console.log('SUPABASE_URL:', process.env.SUPABASE_URL);
console.log('SUPABASE_SERVICE_ROLE_KEY:', process.env.SUPABASE_SERVICE_ROLE_KEY ? 'SET' : 'NOT SET');
console.log('JWT_SECRET:', process.env.JWT_SECRET ? 'SET' : 'NOT SET');
console.log('PORT:', process.env.PORT);
console.log('========================');
