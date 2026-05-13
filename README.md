# CEAR - Sistema de Gestión de Siniestros

## Stack
- **Frontend**: React + Vite + Tailwind CSS
- **Backend**: Node.js + Express
- **Base de datos**: MySQL 8.0

---

## 1. Base de datos

Abrí MySQL Workbench, conectate a `Local instance MySQL80` y ejecutá:

```
C:\Users\Tobi\Desktop\HANDY\CEAR-APP\database\schema.sql
```

Esto crea la base `cear_db` con las tablas y el usuario admin por defecto.

**Credenciales admin por defecto:**
- Usuario: `admin`
- Contraseña: `Admin1234!`

---

## 2. Backend

Editá `backend/.env` con tu contraseña de MySQL y los datos de email.

```bash
cd backend
npm run dev
# Corre en http://localhost:4000
```

---

## 3. Frontend

```bash
cd frontend
npm run dev
# Corre en http://localhost:5173
```

---

## Flujo del sistema

### Como Admin:
1. Login con `admin` / `Admin1234!`
2. Ir a **Clientes** → Crear nuevo cliente (nombre, usuario, contraseña)
3. En el detalle del cliente → Agregar pólizas (automotores o integral de comercio)
4. El cliente ya puede hacer login

### Como Cliente:
1. Login con las credenciales asignadas
2. Ver los formularios disponibles según sus pólizas
3. Completar y enviar → llega un email a los empleados de CEAR

---

## Estructura

```
CEAR-APP/
├── backend/
│   ├── src/
│   │   ├── config/db.js
│   │   ├── middleware/auth.js
│   │   └── routes/  (auth, usuarios, polizas, formularios)
│   └── .env
├── frontend/
│   └── src/
│       ├── pages/
│       │   ├── Login.jsx
│       │   ├── admin/  (Dashboard, Clientes, ClienteDetalle)
│       │   ├── cliente/  (Dashboard)
│       │   └── formularios/  (Automotores, Incendio, Cristales, RC, AvisoViaje)
│       └── components/  (Layout, Sidebar, Toast, CearLogo)
└── database/schema.sql
```
