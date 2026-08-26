"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function RegisterPage() {
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    const { data, error } = await supabase.auth.signUp({
      email: correo,
      password: contrasena
    });

    if (error) {
      alert("❌ Error: " + error.message);
      return;
    }

    alert("✅ ¡Registrado con éxito! 🎉");
    window.location.href = "/login";
  };

  return (
    <div style={{ padding: "2rem", maxWidth: "400px", margin: "0 auto" }}>
      <h1>✨ Registro</h1>
      <form onSubmit={handleRegister}>
        <input type="text" placeholder="Tu nombre" value={nombre} onChange={(e)=>setNombre(e.target.value)} required style={{display:"block",width:"100%",padding:"0.5rem",margin:"0.5rem 0"}}/>
        <input type="email" placeholder="Correo" value={correo} onChange={(e)=>setCorreo(e.target.value)} required style={{display:"block",width:"100%",padding:"0.5rem",margin:"0.5rem 0"}}/>
        <input type="password" placeholder="Contraseña" value={contrasena} onChange={(e)=>setContrasena(e.target.value)} required style={{display:"block",width:"100%",padding:"0.5rem",margin:"0.5rem 0"}}/>
        <button type="submit" style={{padding:"0.75rem 2rem",marginTop:"1rem",cursor:"pointer"}}>✅ Registrarse</button>
      </form>
    </div>
  );
}