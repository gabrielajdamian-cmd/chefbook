"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function DashboardPage() {
  const [usuario, setUsuario] = useState<any>(null);
  const [rol, setRol] = useState<string>("");
  const [cargando, setCargando] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function cargarPerfil() {
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        router.push("/login");
        return;
      }

      setUsuario(session.user);

      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", session.user.id)
        .single();

      if (profile) setRol(profile.role);
      setCargando(false);
    }

    cargarPerfil();
  }, [router]);

  async function cerrarSesion() {
    await supabase.auth.signOut();
    router.push("/login");
  }

  if (cargando) return <p style={{ textAlign: "center", marginTop: "2rem" }}>Cargando panel...</p>;

  return (
    <main style={{ padding: "2rem", maxWidth: "600px", margin: "0 auto", fontFamily: "sans-serif" }}>
      <h1>Panel Principal</h1>

      <div style={{ padding: "1.5rem", backgroundColor: "#f0fdf4", borderRadius: "8px", marginBottom: "1.5rem" }}>
        <p><strong>Correo:</strong> {usuario?.email}</p>
        <p><strong>Rol:</strong> {rol === "chef" ? "👨‍🍳 Chef" : "👤 Lector"}</p>
        <button
          onClick={cerrarSesion}
          style={{ padding: "0.5rem 1rem", backgroundColor: "#ef4444", color: "white", border: "none", borderRadius: "4px", cursor: "pointer", marginTop: "0.5rem" }}
        >
          Cerrar Sesión
        </button>
      </div>

      <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
        <Link
          href="/recetas"
          style={{ padding: "0.75rem 1.5rem", backgroundColor: "#2563eb", color: "white", textDecoration: "none", borderRadius: "6px" }}
        >
          📖 Explorar Recetas
        </Link>

        {rol === "chef" && (
          <Link
            href="/dashboard/nuevo"
            style={{ padding: "0.75rem 1.5rem", backgroundColor: "#16a34a", color: "white", textDecoration: "none", borderRadius: "6px" }}
          >
            ➕ Crear Receta
          </Link>
        )}
      </div>
    </main>
  );
}