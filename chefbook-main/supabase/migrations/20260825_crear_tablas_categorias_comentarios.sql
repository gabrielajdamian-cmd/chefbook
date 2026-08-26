-- Tabla de CATEGORÍAS (ej: Postres, Almuerzos, Cenas, Bebidas...)
CREATE TABLE categorias (
  id SERIAL PRIMARY KEY,
  nombre TEXT NOT NULL UNIQUE,
  descripcion TEXT,
  creada_en TIMESTAMP DEFAULT NOW()
);

-- Tabla de COMENTARIOS (opiniones de los usuarios sobre las recetas)
CREATE TABLE comentarios (
  id SERIAL PRIMARY KEY,
  contenido TEXT NOT NULL,
  puntuacion INT CHECK (puntuacion BETWEEN 1 AND 5),
  usuario_id INT REFERENCES usuarios(id) ON DELETE CASCADE,
  receta_id INT REFERENCES recetas(id) ON DELETE CASCADE,
  creado_en TIMESTAMP DEFAULT NOW()
);

-- Agregamos una columna en recetas para conectarlas con categorías
ALTER TABLE recetas ADD COLUMN categoria_id INT REFERENCES categorias(id) ON DELETE SET NULL;
