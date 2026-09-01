"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

interface Receta {
  id: number;
  nombre: string;
  ingredientes: string;
  pasos: string;
  tiempo_minutos: number;
}

export default function DetalleRecetaPage() {
  const { id } = useParams();
  const router = useRouter();
  const [receta, setReceta] = useState<Receta | null>(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    async function obtenerReceta() {
      if (!id) return;

      const { data, error } = await supabase
        .from("recetas")
        .select("*")
        .eq("id", id)
        .single();

      if (data) {
        setReceta(data);
      }
      setCargando(false);
    }

    obtenerReceta();
  }, [id]);

  if (cargando) return <p style={{ textAlign: "center", marginTop: "2rem" }}>Cargando receta...</p>;

  if (!receta) {
    return (
      <main style={{ padding: "2rem", textAlign: "center", fontFamily: "sans-serif" }}>
        <h2>Receta no encontrada</h2>
        <Link href="/recetas" style={{ color: "#2563eb", textDecoration: "none" }}>
          ← Volver al recetario
        </Link>
      </main>
    );
  }

  return (
    <main style={{ padding: "2rem", maxWidth: "700px", margin: "0 auto", fontFamily: "sans-serif" }}>
      <Link href="/recetas" style={{ color: "#2563eb", textDecoration: "none", display: "inline-block", marginBottom: "1rem" }}>
        ← Volver al recetario
      </Link>

      <div style={{ border: "1px solid #e5e7eb", padding: "1.5rem", borderRadius: "8px", backgroundColor: "#ffffff" }}>
        <h1 style={{ marginTop: 0 }}>{receta.nombre}</h1>
        <p style={{ color: "#6b7280" }}>⏱️ <strong>Tiempo estimado:</strong> {receta.tiempo_minutos} minutos</p>

        <hr style={{ margin: "1.5rem 0", borderColor: "#f3f4f6" }} />

        <h3>🧂 Ingredientes:</h3>
        <p style={{ lineHeight: "1.6", color: "#374151" }}>{receta.ingredientes}</p>

        <h3 style={{ marginTop: "1.5rem" }}>👨‍🍳 Pasos de preparación:</h3>
        <p style={{ lineHeight: "1.6", color: "#374151", whiteSpace: "pre-line" }}>{receta.pasos}</p>
      </div>
    </main>
  );
}
