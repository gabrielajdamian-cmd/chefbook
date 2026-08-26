-- Tabla de usuarios
CREATE TABLE usuarios (
  id SERIAL PRIMARY KEY,
  nombre TEXT NOT NULL,
  correo TEXT UNIQUE NOT NULL,
  contrasena TEXT NOT NULL,
  fecha_registro TIMESTAMP DEFAULT NOW()
);

-- Tabla de ingredientes
CREATE TABLE ingredientes (
  id SERIAL PRIMARY KEY,
  nombre TEXT NOT NULL,
  cantidad TEXT,
  unidad_medida TEXT,
  receta_id INT REFERENCES recetas(id) ON DELETE CASCADE
);
