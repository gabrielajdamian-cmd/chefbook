"use client";

import { useState } from "react";
import { supabase } from "../../lib/supabase";

export default function RegisterPage() {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rol, setRol] = useState("lector");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      alert(error.message);
      return;
    }

    if (data.user) {
      const { error: profileError } = await supabase
        .from("profiles")
        .insert([
          {
            id: data.user.id,
            email: email,
            rol: rol,
          },
        ]);

      if (profileError) {
        alert(profileError.message);
        return;
      }

      alert("Usuario registrado");
    }
  };

  return (
    <div>
      <h1>Registro</h1>

      <form onSubmit={handleRegister}>
        <input
          type="text"
          placeholder="Nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
        />

        <br />

        <input
          type="email"
          placeholder="Correo"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <br />

        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <br />

        <select
          value={rol}
          onChange={(e) => setRol(e.target.value)}
        >
          <option value="lector">lector</option>
          <option value="chef">chef</option>
        </select>

        <br />

        <button type="submit">
          Registrarse
        </button>
      </form>
    </div>
  );
}
