"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    const { data, error } = await supabase.auth.signInWithPassword({
      email: correo,
      password: contrasena,
    });

    if (error) {
      alert("❌ Error: " + error.message);
      return;
    }

    alert(" ¡Bienvenido! Has iniciado sesión 🎉");
    router.push("/recetas");
  };

  return (
    <div style={{ padding: "2rem", maxWidth: "400px", margin: "0 auto" }}>
      <h1>🔐 Iniciar Sesión</h1>
      <form onSubmit={handleLogin}>
        <div style={{ margin: "0.5rem 0" }}>
          <input
            type="email"
            placeholder="Correo electrónico"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            required
            style={{ padding: "0.5rem", width: "100%", fontSize: "16px" }}
          />
        </div>
        <div style={{ margin: "0.5rem 0" }}>
          <input
            type="password"
            placeholder="Contraseña"
            value={contrasena}
            onChange={(e) => setContrasena(e.target.value)}
            required
            style={{ padding: "0.5rem", width: "100%", fontSize: "16px" }}
          />
        </div>
        <button 
          type="submit"
          style={{ padding: "0.75rem 2rem", marginTop: "1rem", cursor: "pointer", width: "100%", fontSize: "16px" }}
        >
          ✅ Ingresar
        </button>
      </form>
    </div>
  );
}