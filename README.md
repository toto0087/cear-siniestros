# CEAR — Sistema de Gestión de Siniestros

Sistema web para la gestión de denuncias de siniestros de **CEAR · Cobertura Educativa · Asesores de Seguros**.

Permite a los clientes completar formularios de siniestros online, que se envían automáticamente por email a los asesores de la empresa.

---

## Stack tecnológico

| Capa | Tecnología |
|------|-----------|
| Frontend | React 19 + Vite + Tailwind CSS |
| Backend | Node.js + Express |
| Base de datos | MySQL 8.0 |
| Autenticación | JWT + bcrypt |
| Email | Nodemailer (Gmail SMTP) |

---

## Estructura del proyecto

```
cear-siniestros/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js              # Conexión MySQL (pool)
│   │   ├── middleware/
│   │   │   └── auth.js            # JWT middleware + rol admin
│   │   └── routes/
│   │       ├── auth.js            # POST /api/auth/login
│   │       ├── usuarios.js        # CRUD clientes (solo admin)
│   │       ├── polizas.js         # CRUD pólizas
│   │       └── formularios.js     # 5 formularios → envío de email
│   ├── .env.example               # Variables de entorno de ejemplo
│   └── package.json
├── frontend/
│   └── src/
│       ├── api/index.js           # Cliente Axios con interceptors
│       ├── context/AuthContext.jsx
│       ├── components/            # Layout, Sidebar, Toast, CearLogo
│       └── pages/
│           ├── Login.jsx
│           ├── admin/             # Dashboard, Clientes, ClienteDetalle
│           ├── cliente/           # Dashboard con tarjetas de formularios
│           └── formularios/       # Automotores, Incendio, Cristales, RC, AvisoViaje
├── database/
│   └── schema.sql                 # Tablas + usuario admin inicial
└── README.md
```

---

## Requisitos previos

Asegurate de tener instalado:

- [Node.js](https://nodejs.org/) v18 o superior
- [MySQL 8.0](https://dev.mysql.com/downloads/mysql/) (o MySQL Workbench)
- [Git](https://git-scm.com/)
- Una cuenta de Gmail con [verificación en 2 pasos activada](https://myaccount.google.com/security)

---

## Instalación paso a paso

### 1. Clonar el repositorio

```bash
git clone https://github.com/toto0087/cear-siniestros.git
cd cear-siniestros
```

---

### 2. Configurar la base de datos MySQL

#### 2a. Abrir MySQL Workbench y conectarte a tu instancia local

#### 2b. Ejecutar el schema

Abrí el archivo `database/schema.sql` en Workbench y ejecutalo con el botón ⚡ (o Ctrl+Shift+Enter).

Esto crea:
- La base de datos `cear_db`
- Las tablas `usuarios`, `polizas` y `patentes`
- Un usuario **admin** por defecto

**Credenciales admin por defecto:**
```
Usuario:    admin
Contraseña: Admin1234!
```

> ⚠️ Cambiá la contraseña del admin en producción.

---

### 3. Configurar el Backend

#### 3a. Instalar dependencias

```bash
cd backend
npm install
```

#### 3b. Crear el archivo `.env`

Copiá el archivo de ejemplo y completá tus datos:

```bash
cp .env.example .env
```

Editá `.env` con tus valores reales:

```env
PORT=4000

# MySQL — tu usuario y contraseña de MySQL local
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=tu_contraseña_mysql
DB_NAME=cear_db

# JWT — cambialo por cualquier string secreto largo
JWT_SECRET=cambia_esto_por_algo_muy_secreto_2026

# Email — configuración Gmail (ver sección más abajo)
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USER=tucuenta@gmail.com
MAIL_PASS=abcdefghijklmnop
MAIL_FROM="CEAR Sistema <tucuenta@gmail.com>"

# Emails que reciben las denuncias (separados por coma)
EMPLEADOS_EMAILS=asesor1@cear.com.ar,asesor2@cear.com.ar
```

#### 3c. Obtener la App Password de Gmail

El sistema envía emails usando tu cuenta de Gmail. **No uses tu contraseña real**, usá una App Password:

1. Entrá a [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords)
   *(Requiere tener la verificación en 2 pasos activa)*
2. Poné un nombre como `CEAR`
3. Hacé click en **Crear**
4. Copiá las 16 letras generadas (sin espacios) y pegálas en `MAIL_PASS`

---

### 4. Configurar el Frontend

```bash
cd ../frontend
npm install
```

No requiere ninguna configuración adicional. El frontend se conecta al backend automáticamente a través del proxy de Vite (`localhost:4000`).

---

### 5. Levantar el proyecto

Necesitás **dos terminales abiertas** al mismo tiempo:

**Terminal 1 — Backend:**
```bash
cd backend
npm run dev
# ✅ Corre en http://localhost:4000
```

**Terminal 2 — Frontend:**
```bash
cd frontend
npm run dev
# ✅ Corre en http://localhost:5173
```

Abrí **http://localhost:5173** en el navegador.

---

## Cómo usar el sistema

### Flujo completo

```
Admin crea cliente → Admin asigna pólizas → Cliente hace login → Cliente envía formulario → Email llega a asesores
```

### Como Administrador

1. Loguear con `admin` / `Admin1234!`
2. Ir a **Clientes → Nuevo cliente**
3. Completar nombre, apellido, usuario y contraseña del cliente
4. Una vez creado, ir al detalle del cliente y agregar sus **pólizas**
5. El cliente ya puede ingresar al sistema

### Como Cliente

1. Loguear con las credenciales que el admin le asignó
2. Ver el dashboard con los 5 tipos de formularios
3. Los formularios habilitados (en color) son los que cubre su póliza
4. Los bloqueados (en gris) no están cubiertos por su seguro
5. Completar el formulario correspondiente y adjuntar archivos si es necesario
6. Al enviar, el sistema manda un email automático a los asesores con todos los datos

---

## Tipos de pólizas

### Automotores
Cubre el formulario de **Siniestro de Automotores**. Se registra la/s patente/s del vehículo asegurado.

### Integral de Comercio
Puede cubrir una combinación de:

| Cobertura | Formulario habilitado |
|-----------|----------------------|
| Incendio | Siniestro de Incendio |
| Cristales | Siniestro de Cristales |
| Responsabilidad Civil | Siniestro de RC |
| Aviso de Viaje | Aviso de Viaje Escolar |

---

## API Endpoints

### Auth
| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | `/api/auth/login` | Login → devuelve JWT |

### Usuarios *(requiere token admin)*
| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/usuarios` | Listar todos los clientes |
| GET | `/api/usuarios/:id` | Ver un cliente |
| POST | `/api/usuarios` | Crear cliente |
| PUT | `/api/usuarios/:id` | Editar cliente |
| DELETE | `/api/usuarios/:id` | Desactivar cliente |

### Pólizas
| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/polizas/mis-polizas` | Pólizas del cliente logueado |
| GET | `/api/polizas/usuario/:id` | Pólizas de un cliente *(admin)* |
| POST | `/api/polizas` | Crear póliza *(admin)* |
| PUT | `/api/polizas/:id` | Editar póliza *(admin)* |
| DELETE | `/api/polizas/:id` | Eliminar póliza *(admin)* |

### Formularios *(requiere token cliente)*
| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | `/api/formularios/automotores` | Enviar denuncia automotores |
| POST | `/api/formularios/incendio` | Enviar denuncia incendio |
| POST | `/api/formularios/cristales` | Enviar denuncia cristales |
| POST | `/api/formularios/rc` | Enviar denuncia responsabilidad civil |
| POST | `/api/formularios/aviso-viaje` | Enviar aviso de viaje escolar |

---

## Variables de entorno

| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| `PORT` | Puerto del backend | `4000` |
| `DB_HOST` | Host de MySQL | `localhost` |
| `DB_PORT` | Puerto de MySQL | `3306` |
| `DB_USER` | Usuario MySQL | `root` |
| `DB_PASSWORD` | Contraseña MySQL | `mipassword` |
| `DB_NAME` | Nombre de la base | `cear_db` |
| `JWT_SECRET` | Clave secreta para firmar tokens | cualquier string largo |
| `MAIL_HOST` | Servidor SMTP | `smtp.gmail.com` |
| `MAIL_PORT` | Puerto SMTP | `587` |
| `MAIL_USER` | Email remitente | `tucuenta@gmail.com` |
| `MAIL_PASS` | App Password de Gmail (16 chars, sin espacios) | `abcdefghijklmnop` |
| `MAIL_FROM` | Nombre visible del remitente | `"CEAR Sistema <tu@gmail.com>"` |
| `EMPLEADOS_EMAILS` | Destinatarios de las denuncias | `e1@mail.com,e2@mail.com` |

---

## Problemas comunes

**❌ Error al conectar a MySQL**
- Verificá que MySQL esté corriendo
- Confirmá usuario y contraseña en `.env`
- Asegurate de haber ejecutado `database/schema.sql`

**❌ No llegan los emails**
- Verificá que `MAIL_PASS` sea la App Password sin espacios
- Revisá que la verificación en 2 pasos esté activa en tu cuenta Google
- Confirmá que `EMPLEADOS_EMAILS` tenga emails válidos

**❌ El login no funciona con `admin` / `Admin1234!`**
- Asegurate de haber ejecutado el schema SQL completo (incluye el INSERT del admin)
- Si ya tenías la DB de antes, ejecutá manualmente en Workbench:
```sql
USE cear_db;
DELETE FROM usuarios WHERE username = 'admin';
INSERT INTO usuarios (nombre, apellido, cuil, email, username, password_hash, rol)
VALUES ('Admin','CEAR','20-00000000-0','admin@cear.com.ar','admin',
'$2b$10$I8cgnA.vqoAyqGwmljsugeUJbJVIy81mdfV2qPPj6h1xpZyLNFQDy','admin');
```

---

## Licencia

MIT — libre para uso educativo y comercial.
