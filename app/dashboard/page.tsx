"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const [email, setEmail] = useState("");
  const [rol, setRol] = useState("");
  const router = useRouter();

  useEffect(() => {
    async function getProfile() {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        setEmail(user.email || "");

        // Va a Supabase a buscar el rol exacto de este usuario
        const { data: profile } = await supabase
          .from("profiles")
          .select("rol")
          .eq("id", user.id)
          .single();

        if (profile) {
          setRol(profile.rol); // Aquí toma "chef" o "lector" de la base de datos
        }
      }
    }

    getProfile();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Panel Principal</h2>
      <div style={{ background: "#f0fdf4", padding: "15px", borderRadius: "8px", maxWidth: "400px" }}>
        <p><strong>Correo:</strong> {email}</p>
        <p><strong>Rol:</strong> {rol === "chef" ? "👨‍🍳 Chef" : "👤 Lector"}</p>
        <button 
          onClick={handleLogout} 
          style={{ background: "#ef4444", color: "white", padding: "8px 12px", border: "none", borderRadius: "4px", cursor: "pointer" }}
        >
          Cerrar Sesión
        </button>
      </div>

      {rol === "chef" && (
        <div style={{ marginTop: "15px" }}>
          <button 
            onClick={() => router.push("/recipes/new")}
            style={{ background: "#10b981", color: "white", padding: "10px 15px", border: "none", borderRadius: "4px", cursor: "pointer" }}
          >
            ➕ Crear Receta
          </button>
        </div>
      )}

      <div style={{ marginTop: "15px" }}>
        <button 
          onClick={() => router.push("/recipes")}
          style={{ background: "#3b82f6", color: "white", padding: "10px 15px", border: "none", borderRadius: "4px", cursor: "pointer" }}
        >
          📖 Explorar Recetas
        </button>
      </div>
    </div>
  );
}