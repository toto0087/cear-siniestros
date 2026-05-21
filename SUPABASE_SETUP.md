# Guía: Conectar Supabase al Proyecto CEAR

## 1. Crear Proyecto en Supabase

1. Ir a [supabase.com](https://supabase.com)
2. Registrarse o iniciar sesión
3. Crear un nuevo proyecto:
   - Click en "New Project"
   - Ingresar nombre del proyecto: `cear-siniestros`
   - Crear contraseña fuerte
   - Seleccionar región (ej: `us-east-1`)
4. Esperar a que se cree el proyecto (2-3 minutos)

## 2. Obtener Credenciales

1. En el panel de Supabase, ir a **Settings** → **API**
2. Copiar los valores:
   - **Project URL** → `SUPABASE_URL`
   - **anon public** key → `SUPABASE_ANON_KEY`
   - **service_role** secret → `SUPABASE_SERVICE_ROLE_KEY` (mantener privado)

## 3. Crear el Schema

1. Ir a **SQL Editor** en Supabase
2. Click en "New Query"
3. Copiar y ejecutar el contenido de `database/schema.sql`:
   ```sql
   -- Pegar contenido de schema.sql aquí
   ```
4. Click en "Run" para crear las tablas

## 4. Configurar Variables de Entorno

1. En la raíz de `backend/`, copiar `.env.example` a `.env`:
   ```bash
   cp .env.example .env
   ```

2. Editar `.env` y reemplazar los valores:
   ```bash
   SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_ANON_KEY=eyJhbGc...
   SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...
   ```

## 5. Instalar Dependencias

```bash
cd backend
npm install
```

## 6. Probar Conexión

```bash
npm run dev
```

Debe mostrar: `CEAR backend corriendo en http://localhost:4000`

## 7. Verificar Endpoints

Probar que los endpoints funcionan:
- `POST /api/auth/login` - Login
- `GET /api/usuarios` - Listar clientes (requiere admin token)
- `POST /api/usuarios` - Crear cliente

## Notas Importantes

- **SUPABASE_ANON_KEY**: Es pública, se puede exponer
- **SUPABASE_SERVICE_ROLE_KEY**: Mantener en secreto (solo backend)
- El adaptador en `db.js` convierte queries MySQL a Supabase automáticamente
- Si encuentras errores SQL complejos, considera usar `supabase.rpc()` para funciones almacenadas

## Solución de Problemas

### Error: "SUPABASE_URL or SUPABASE_ANON_KEY are required"
→ Verificar que `.env` tenga las credenciales correctas

### Error al hacer queries
→ Verificar que las tablas existan en Supabase (ir a SQL Editor y revisar)

### Cambios en schema después del inicio
→ Ir a SQL Editor y ejecutar los scripts de migración manualmente
