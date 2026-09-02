"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function RecetasPage() {
  const [recetas, setRecetas] = useState<any[]>([]);
  const [cargando, setCargando] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function obtenerRecetasExternas() {
      try {
        // Hacemos el fetch a la API externa pública de recetas
        const respuesta = await fetch("https://www.themealdb.com/api/json/v1/1/search.php?s=chicken");
        const datos = await respuesta.json();
        
        // Guardamos las recetas en el estado (la API devuelve un array llamado 'meals')
        setRecetas(datos.meals || []);
      } catch (error) {
        console.error("Error al consumir la API externa:", error);
      } finally {
        setCargando(false);
      }
    }

    obtenerRecetasExternas();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <button 
        onClick={() => router.push("/dashboard")}
        style={{ marginBottom: "20px", padding: "8px 12px", cursor: "pointer" }}
      >
        ← Volver al Panel
      </button>

      <h1>📖 Explorar Recetas (API Externa)</h1>
      
      {cargando && <p>Buscando recetas en la red...</p>}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: "20px", marginTop: "20px" }}>
        {recetas.map((receta) => (
          <div key={receta.idMeal} style={{ border: "1px solid #ddd", padding: "15px", borderRadius: "8px", background: "#fff" }}>
            <img 
              src={receta.strMealThumb} 
              alt={receta.strMeal} 
              style={{ width: "100%", height: "150px", objectFit: "cover", borderRadius: "6px" }} 
            />
            <h3 style={{ fontSize: "18px", margin: "10px 0 5px 0" }}>{receta.strMeal}</h3>
            <p style={{ fontSize: "14px", color: "#666" }}>
              <strong>Categoría:</strong> {receta.strCategory} | <strong>País:</strong> {receta.strArea}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}