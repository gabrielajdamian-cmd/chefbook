"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegistroPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rol, setRol] = useState("Lector"); // Valor por defecto
  const [mensaje, setMensaje] = useState("");
  const [cargando, setCargando] = useState(false);

  async function handleRegistro(e: React.FormEvent) {
    e.preventDefault();
    setCargando(true);
    setMensaje("");

    // Guardamos el correo, contraseña y el ROL seleccionado en user_metadata
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          rol: rol, // Se guarda "Chef" o "Lector"
        },
      },
    });

    setCargando(false);

    if (error) {
      setMensaje("Error al registrarse: " + error.message);
    } else {
      alert("¡Cuenta creada con éxito con el rol de: " + rol + "!");
      router.push("/dashboard");
    }
  }

  return (
    <main style={{ maxWidth: "400px", margin: "3rem auto", padding: "1.5rem", border: "1px solid #e5e7eb", borderRadius: "8px", fontFamily: "sans-serif" }}>
      <h2>Crear Cuenta</h2>

      {mensaje && <p style={{ color: "red", fontSize: "14px" }}>{mensaje}</p>}

      <form onSubmit={handleRegistro} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <div>
          <label style={{ display: "block", marginBottom: "0.25rem", fontWeight: "bold" }}>Correo Electrónico:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ width: "100%", padding: "0.5rem", borderRadius: "4px", border: "1px solid #ccc" }}
          />
        </div>

        <div>
          <label style={{ display: "block", marginBottom: "0.25rem", fontWeight: "bold" }}>Contraseña:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ width: "100%", padding: "0.5rem", borderRadius: "4px", border: "1px solid #ccc" }}
          />
        </div>

        {/* SELECTOR AUTOMÁTICO DE ROL */}
        <div>
          <label style={{ display: "block", marginBottom: "0.25rem", fontWeight: "bold" }}>Selecciona tu Rol:</label>
          <select
            value={rol}
            onChange={(e) => setRol(e.target.value)}
            style={{ width: "100%", padding: "0.5rem", borderRadius: "4px", border: "1px solid #ccc", backgroundColor: "white" }}
          >
            <option value="Lector">👤 Lector (Solo explorar recetas)</option>
            <option value="Chef">👨‍🍳 Chef (Crear, editar y eliminar mis recetas)</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={cargando}
          style={{
            padding: "0.75rem",
            backgroundColor: cargando ? "#9ca3af" : "#2563eb",
            color: "white",
            border: "none",
            borderRadius: "4px",
            fontWeight: "bold",
            cursor: cargando ? "not-allowed" : "pointer",
          }}
        >
          {cargando ? "Registrando..." : "Registrarse"}
        </button>
      </form>

      <p style={{ marginTop: "1rem", fontSize: "14px" }}>
        ¿Ya tienes cuenta? <Link href="/login" style={{ color: "#2563eb" }}>Inicia Sesión</Link>
      </p>
    </main>
  );
}