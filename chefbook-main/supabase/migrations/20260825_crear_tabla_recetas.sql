CREATE TABLE recetas (
  id SERIAL PRIMARY KEY,
  nombre TEXT NOT NULL,
  ingredientes TEXT NOT NULL,
  pasos TEXT,
  tiempo_minutos INT,
  creada_en TIMESTAMP DEFAULT NOW()
);
