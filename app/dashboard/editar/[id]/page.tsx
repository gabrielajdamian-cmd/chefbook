"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

export default function EditarRecetaPage() {
  const { id } = useParams();
  const router = useRouter();

  const [nombre, setNombre] = useState("");
  const [ingredientes, setIngredientes] = useState("");
  const [pasos, setPasos] = useState("");
  const [tiempoMinutos, setTiempoMinutos] = useState<number | "">("");
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    async function obtenerReceta() {
      if (!id) return;

      const { data, error } = await supabase
        .from("recetas")
        .select("*")
        .eq("id", id)
        .single();

      if (data) {
        setNombre(data.nombre);
        setIngredientes(data.ingredientes);
        setPasos(data.pasos);
        setTiempoMinutos(data.tiempo_minutos);
      }
      setCargando(false);
    }

    obtenerReceta();
  }, [id]);

  async function handleUpdate(e: React.FormEvent) {
    e.preventDefault();
    setGuardando(true);
    setMensaje("");

    const { error } = await supabase
      .from("recetas")
      .update({
        nombre,
        ingredientes,
        pasos,
        tiempo_minutos: Number(tiempoMinutos),
      })
      .eq("id", id);

    setGuardando(false);

    if (error) {
      setMensaje("Error al actualizar la receta: " + error.message);
    } else {
      router.push("/recetas");
    }
  }

  if (cargando) return <p style={{ textAlign: "center", marginTop: "2rem" }}>Cargando datos...</p>;

  return (
    <main style={{ padding: "2rem", maxWidth: "600px", margin: "0 auto", fontFamily: "sans-serif" }}>
      <Link href="/recetas" style={{ color: "#2563eb", textDecoration: "none", display: "inline-block", marginBottom: "1rem" }}>
        ← Volver al Recetario
      </Link>

      <h1>Editar Receta</h1>

      {mensaje && <p style={{ color: "red" }}>{mensaje}</p>}

      <form onSubmit={handleUpdate} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <div>
          <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "bold" }}>Nombre de la Receta:</label>
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
            style={{ width: "100%", padding: "0.5rem", borderRadius: "4px", border: "1px solid #ccc" }}
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
          />
        </div>

        <button
          type="submit"
          disabled={guardando}
          style={{
            padding: "0.75rem",
            backgroundColor: guardando ? "#9ca3af" : "#2563eb",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: guardando ? "not-allowed" : "pointer",
            fontWeight: "bold",
            marginTop: "1rem",
          }}
        >
          {guardando ? "Guardando..." : "Actualizar Receta"}
        </button>
      </form>
    </main>
  );
}