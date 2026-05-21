# ✅ Conexión a Supabase - COMPLETADA

Tu backend ahora está conectado a Supabase y funcionando. Sin embargo, necesitas completar los siguientes pasos:

## 🔴 PRÓXIMO PASO: Crear el Schema en Supabase

1. **Ir al SQL Editor** en tu dashboard de Supabase:
   - Abre: https://app.supabase.com/project/ldqnqaywpfzokwpxapgw/sql/new
   - O navega a: Dashboard → SQL Editor → New Query

2. **Copiar y pegar el siguiente SQL**:

```sql
-- ============================================================
-- CEAR - Cobertura Educativa | Asesores de Seguros
-- Schema PostgreSQL (Supabase)
-- ============================================================

-- Usuarios (admin + clientes)
CREATE TABLE IF NOT EXISTS usuarios (
  id            SERIAL PRIMARY KEY,
  nombre        VARCHAR(100) NOT NULL,
  apellido      VARCHAR(100) NOT NULL,
  cuil          VARCHAR(20),
  direccion     VARCHAR(255),
  email         VARCHAR(150),
  username      VARCHAR(50) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  rol           VARCHAR(10) NOT NULL DEFAULT 'cliente' CHECK (rol IN ('admin', 'cliente')),
  activo        BOOLEAN NOT NULL DEFAULT true,
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Pólizas (automotores | integral_comercio)
CREATE TABLE IF NOT EXISTS polizas (
  id                   SERIAL PRIMARY KEY,
  usuario_id           INT NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  numero_poliza        VARCHAR(80) NOT NULL,
  tipo                 VARCHAR(50) NOT NULL CHECK (tipo IN ('automotores', 'integral_comercio')),
  fecha_inicio         DATE NOT NULL,
  fecha_fin            DATE NOT NULL,
  -- Coberturas para integral de comercio
  cubre_incendio       BOOLEAN DEFAULT false,
  cubre_cristales      BOOLEAN DEFAULT false,
  cubre_rc             BOOLEAN DEFAULT false,
  cubre_aviso_viaje    BOOLEAN DEFAULT false,
  created_at           TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Patentes de vehículos (para pólizas de automotores)
CREATE TABLE IF NOT EXISTS patentes (
  id         SERIAL PRIMARY KEY,
  poliza_id  INT NOT NULL REFERENCES polizas(id) ON DELETE CASCADE,
  patente    VARCHAR(20) NOT NULL
);

-- ============================================================
-- Seed: usuario admin por defecto
-- password: Admin1234!  (bcrypt hash generado con 10 rounds)
-- ============================================================
INSERT INTO usuarios (nombre, apellido, cuil, email, username, password_hash, rol)
VALUES (
  'Admin', 'CEAR', '20-00000000-0', 'admin@cear.com.ar', 'admin',
  '$2b$10$I8cgnA.vqoAyqGwmljsugeUJbJVIy81mdfV2qPPj6h1xpZyLNFQDy',
  'admin'
) ON CONFLICT (username) DO NOTHING;
```

3. **Click en "Run"** y espera a que se ejecute

4. **Verificar** que se crearon las tablas:
   - Ve a "Database" → "Tables"
   - Deberías ver: `usuarios`, `polizas`, `patentes`

## ✅ Verificar que Todo Funciona

Una vez creado el schema, ejecuta:

```bash
cd backend
npm run dev
```

Luego en otra terminal:

```bash
node test-query.js
```

Deberías ver:
```
✅ Query ejecutada
Rows: [ { id: 1, username: 'admin', ... } ]
Primer row: { id: 1, username: 'admin', ... }
```

## 🧪 Probar el Login

```bash
node test-login.js
```

Deberías obtener:
```json
{
  "token": "eyJhbGciOi...",
  "user": {
    "id": 1,
    "nombre": "Admin",
    "apellido": "CEAR",
    "rol": "admin",
    "username": "admin"
  }
}
```

## 📝 Notas

- ✅ Backend conectado a Supabase
- ✅ REST API de Supabase funcionando
- ✅ Sistema de queries adaptado a Supabase
- ❌ Schema todavía no creado (próximo paso)
- ❌ Usuario admin todavía no creado

Ejecuta el SQL arriba y listo!
