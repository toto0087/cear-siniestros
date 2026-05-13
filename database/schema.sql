-- ============================================================
-- CEAR - Cobertura Educativa | Asesores de Seguros
-- Schema MySQL
-- ============================================================

CREATE DATABASE IF NOT EXISTS cear_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE cear_db;

-- Usuarios (admin + clientes)
CREATE TABLE IF NOT EXISTS usuarios (
  id            INT PRIMARY KEY AUTO_INCREMENT,
  nombre        VARCHAR(100) NOT NULL,
  apellido      VARCHAR(100) NOT NULL,
  cuil          VARCHAR(20),
  direccion     VARCHAR(255),
  email         VARCHAR(150),
  username      VARCHAR(50) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  rol           ENUM('admin','cliente') NOT NULL DEFAULT 'cliente',
  activo        TINYINT(1) NOT NULL DEFAULT 1,
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Pólizas (automotores | integral_comercio)
CREATE TABLE IF NOT EXISTS polizas (
  id                   INT PRIMARY KEY AUTO_INCREMENT,
  usuario_id           INT NOT NULL,
  numero_poliza        VARCHAR(80) NOT NULL,
  tipo                 ENUM('automotores','integral_comercio') NOT NULL,
  fecha_inicio         DATE NOT NULL,
  fecha_fin            DATE NOT NULL,
  -- Coberturas para integral de comercio
  cubre_incendio       TINYINT(1) DEFAULT 0,
  cubre_cristales      TINYINT(1) DEFAULT 0,
  cubre_rc             TINYINT(1) DEFAULT 0,
  cubre_aviso_viaje    TINYINT(1) DEFAULT 0,
  created_at           TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

-- Patentes de vehículos (para pólizas de automotores)
CREATE TABLE IF NOT EXISTS patentes (
  id         INT PRIMARY KEY AUTO_INCREMENT,
  poliza_id  INT NOT NULL,
  patente    VARCHAR(20) NOT NULL,
  FOREIGN KEY (poliza_id) REFERENCES polizas(id) ON DELETE CASCADE
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
);
