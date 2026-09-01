"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function NuevaRecetaPage() {
  const [nombre, setNombre] = useState("");
  const [ingredientes, setIngredientes] = useState("");
  const [pasos, setPasos] = useState("");
  const [tiempoMinutos, setTiempoMinutos] = useState<number | "">("");
  const [guardando, setGuardando] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setGuardando(true);
    setMensaje("");

    const { error } = await supabase.from("recetas").insert([
      {
        nombre,
        ingredientes,
        pasos,
        tiempo_minutos: Number(tiempoMinutos),
      },
    ]);

    setGuardando(false);

    if (error) {
      setMensaje("Error al guardar la receta: " + error.message);
    } else {
      router.push("/recetas");
    }
  }

  return (
    <main style={{ padding: "2rem", maxWidth: "600px", margin: "0 auto", fontFamily: "sans-serif" }}>
      <Link href="/dashboard" style={{ color: "#2563eb", textDecoration: "none", display: "inline-block", marginBottom: "1rem" }}>
        ← Volver al Dashboard
      </Link>

      <h1>Crear Nueva Receta</h1>

      {mensaje && <p style={{ color: "red" }}>{mensaje}</p>}

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <div>
          <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "bold" }}>Nombre de la Receta:</label>
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
            style={{ width: "100%", padding: "0.5rem", borderRadius: "4px", border: "1px solid #ccc" }}
            placeholder="Ej. Seco de Pollo"
          />
        </div>

        <div>
          <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "bold" }}>Ingredientes:</label>
          <textarea
            value={ingredientes}
            onChange={(e) => setIngredientes(e.target.value)}
            required
            rows={3}
            style={{ width: "100%", padding: "0.5rem", borderRadius: "4px", border: "1px solid #ccc" }}
            placeholder="Ej. Pollo, naranjilla, cilantro, cebolla..."
          />
        </div>

        <div>
          <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "bold" }}>Pasos de Preparación:</label>
          <textarea
            value={pasos}
            onChange={(e) => setPasos(e.target.value)}
            required
            rows={4}
            style={{ width: "100%", padding: "0.5rem", borderRadius: "4px", border: "1px solid #ccc" }}
            placeholder="Ej. 1. Dorar el pollo. 2. Licuar la naranjilla..."
          />
        </div>

        <div>
          <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "bold" }}>Tiempo (en minutos):</label>
          <input
            type="number"
            value={tiempoMinutos}
            onChange={(e) => setTiempoMinutos(e.target.value === "" ? "" : Number(e.target.value))}
            required
            min="1"
            style={{ width: "100%", padding: "0.5rem", borderRadius: "4px", border: "1px solid #ccc" }}
            placeholder="45"
          />
        </div>

        <button
          type="submit"
          disabled={guardando}
          style={{
            padding: "0.75rem",
            backgroundColor: guardando ? "#9ca3af" : "#16a34a",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: guardando ? "not-allowed" : "pointer",
            fontWeight: "bold",
            marginTop: "1rem",
          }}
        >
          {guardando ? "Guardando..." : "Publicar Receta"}
        </button>
      </form>
    </main>
  );
}
