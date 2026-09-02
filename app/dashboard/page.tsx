"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function DashboardPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [rol, setRol] = useState("");
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    async function obtenerUsuario() {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        router.push("/login");
        return;
      }

      setEmail(user.email || "");
      // Lee dinámicamente el rol asignado en el registro (por defecto "Lector" si no se especificó)
      setRol(user.user_metadata?.rol || "Lector");
      setCargando(false);
    }

    obtenerUsuario();
  }, [router]);

  async function handleCerrarSesion() {
    await supabase.auth.signOut();
    router.push("/login");
  }

  if (cargando) return <p style={{ textAlign: "center", marginTop: "2rem" }}>Cargando panel...</p>;

  return (
    <main style={{ padding: "2rem", maxWidth: "600px", margin: "0 auto", fontFamily: "sans-serif" }}>
      <h1>Panel Principal</h1>

      <div style={{ backgroundColor: "#f0fdf4", border: "1px solid #bbf7d0", padding: "1.5rem", borderRadius: "8px", marginBottom: "1.5rem" }}>
        <p style={{ margin: "0.5rem 0", fontWeight: "bold" }}>Correo: <span style={{ fontWeight: "normal" }}>{email}</span></p>
        <p style={{ margin: "0.5rem 0", fontWeight: "bold" }}>
          Rol: <span style={{ fontWeight: "normal" }}>👤 {rol}</span>
        </p>

        <button
          onClick={handleCerrarSesion}
          style={{
            marginTop: "1rem",
            padding: "0.5rem 1rem",
            backgroundColor: "#ef4444",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          Cerrar Sesión
        </button>
      </div>

      <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
        <Link
          href="/recetas"
          style={{
            padding: "0.75rem 1.25rem",
            backgroundColor: "#3b82f6",
            color: "white",
            textDecoration: "none",
            borderRadius: "6px",
            fontWeight: "bold",
          }}
        >
          📖 Explorar Recetas
        </Link>

        {/* Muestra el botón de Crear Receta solo si el rol registrado es Chef */}
        {rol === "Chef" && (
          <Link
            href="/dashboard/nuevo"
            style={{
              padding: "0.75rem 1.25rem",
              backgroundColor: "#10b981",
              color: "white",
              textDecoration: "none",
              borderRadius: "6px",
              fontWeight: "bold",
            }}
          >
            ➕ Crear Nueva Receta
          </Link>
        )}
      </div>
    </main>
  );
}