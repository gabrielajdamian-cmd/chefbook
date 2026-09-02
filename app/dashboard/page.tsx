import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

export default function DashboardPage() {
  const [email, setEmail] = useState("");
  const [rol, setRol] = useState("");

  useEffect(() => {
    async function getProfile() {
      // 1. Obtener el usuario conectado actualmente
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        setEmail(user.email || "");

        // 2. Buscar su rol real en la tabla profiles
        const { data: profile } = await supabase
          .from("profiles")
          .select("rol")
          .eq("id", user.id)
          .single();

        if (profile) {
          setRol(profile.rol); // Aquí toma 'chef' o 'lector' automáticamente de la base de datos
        }
      }
    }

    getProfile();
  }, []);

  return (
    <div>
      <h2>Panel Principal</h2>
      <p><strong>Correo:</strong> {email}</p>
      <p><strong>Rol:</strong> {rol === "chef" ? "👨‍🍳 Chef" : "👤 Lector"}</p>
    </div>
  );
}
