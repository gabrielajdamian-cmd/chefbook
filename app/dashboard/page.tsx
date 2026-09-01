"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Receta {
  id: number;
  nombre: string;
  ingredientes: string;
  pasos: string;
  tiempo_minutos: number;
}

export default function DashboardPage() {
  const [usuario, setUsuario] = useState<any>(null);
  const [rol, setRol] = useState<string>("");
  const [recetas, setRecetas] = useState<Receta[]>([]);
  const [cargando, setCargando] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function cargarDatos() {
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        router.push("/login");
        return;
      }

      setUsuario(session.user);

      // Obtener el rol del usuario
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", session.user.id)
        .single();

      if (profile) {
        setRol(profile.role);
      }

      // Obtener la lista de recetas
      const { data: listaRecetas, error } = await supabase
        .from("recetas")
        .select("*");

      if (listaRecetas) {
        setRecetas(listaRecetas);
      }

      setCargando(false);
    }

    cargarDatos();
  }, [router]);

  async function cerrarSesion() {
    await supabase.auth.signOut();
    router.push("/login");
  }

  if (cargando) return <p style={{ textAlign: "center", marginTop: "2rem" }}>Cargando...</p>;

  return (
    <main style={{ padding: "2rem", maxWidth: "800px", margin: "0 auto", fontFamily: "sans-serif" }}>
      <h1>Bienvenido, {usuario?.email}</h1>

      <div style={{ padding: "1rem", backgroundColor: "#f0fdf4", borderRadius: "8px", marginBottom: "1.5rem" }}>
        <p><strong>Rol:</strong> {rol === "chef" ? "👨‍🍳 Chef" : "👤 Lector"}</p>
        <p><strong>Correo:</strong> {usuario?.email}</p>
        <button
          onClick={cerrarSesion}
          style={{ padding: "0.5rem 1rem", backgroundColor: "#ef4444", color: "white", border: "none", borderRadius: "4px", cursor: "pointer", marginTop: "0.5rem" }}
        >
          Cerrar Sesión
        </button>
      </div>

      {rol === "chef" && (
        <div style={{ marginBottom: "1.5rem" }}>
          <Link
            href="/dashboard/nuevo"
            style={{ padding: "0.5rem 1rem", backgroundColor: "#16a34a", color: "white", textDecoration: "none", borderRadius: "4px" }}
          >
            + Crear Nueva Receta
          </Link>
        </div>
      )}

      <h2>Recetas Disponibles</h2>
      {recetas.length === 0 ? (
        <p>No hay recetas registradas todavía.</p>
      ) : (
        <div style={{ display: "grid", gap: "1rem", marginTop: "1rem" }}>
          {recetas.map((receta) => (
            <div key={receta.id} style={{ border: "1px solid #e5e7eb", padding: "1rem", borderRadius: "8px" }}>
              <h3 style={{ margin: "0 0 0.5rem 0" }}>{receta.nombre}</h3>
              <p style={{ margin: "0 0 0.5rem 0", color: "#4b5563" }}>
                <strong>Ingredientes:</strong> {receta.ingredientes}
              </p>
              <p style={{ margin: "0 0 0.5rem 0", color: "#6b7280", fontSize: "0.9rem" }}>
                ⏱️ {receta.tiempo_minutos} minutos
              </p>
              <Link
                href={`/recetas/${receta.id}`}
                style={{ display: "inline-block", marginTop: "0.5rem", color: "#2563eb", textDecoration: "none" }}
              >
                Ver receta completa →
              </Link>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}