"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

interface Receta {
  id: number;
  nombre: string;
  ingredientes: string;
  pasos: string;
  tiempo_minutos: number;
}

export default function RecetasPage() {
  const [recetas, setRecetas] = useState<Receta[]>([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    async function obtenerRecetas() {
      const { data } = await supabase.from("recetas").select("*");
      if (data) setRecetas(data);
      setCargando(false);
    }
    obtenerRecetas();
  }, []);

  if (cargando) return <p style={{ textAlign: "center", marginTop: "2rem" }}>Cargando recetas...</p>;

  return (
    <main style={{ padding: "2rem", maxWidth: "800px", margin: "0 auto", fontFamily: "sans-serif" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
        <h1>Recetario</h1>
        <Link href="/dashboard" style={{ color: "#2563eb", textDecoration: "none" }}>
          ← Volver al Dashboard
        </Link>
      </div>

      {recetas.length === 0 ? (
        <p>No hay recetas registradas todavía.</p>
      ) : (
        <div style={{ display: "grid", gap: "1rem" }}>
          {recetas.map((receta) => (
            <div key={receta.id} style={{ border: "1px solid #e5e7eb", padding: "1.2rem", borderRadius: "8px" }}>
              <h2 style={{ margin: "0 0 0.5rem 0" }}>{receta.nombre}</h2>
              <p style={{ margin: "0 0 0.5rem 0", color: "#4b5563" }}>
                <strong>Ingredientes:</strong> {receta.ingredientes}
              </p>
              <p style={{ margin: "0 0 0.5rem 0", color: "#6b7280", fontSize: "0.9rem" }}>
                ⏱️ {receta.tiempo_minutos} minutos
              </p>
              <Link
                href={`/recetas/${receta.id}`}
                style={{ display: "inline-block", marginTop: "0.5rem", color: "#2563eb", textDecoration: "none", fontWeight: "bold" }}
              >
                Ver preparación completa →
              </Link>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
