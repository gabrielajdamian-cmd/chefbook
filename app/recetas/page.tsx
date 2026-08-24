"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function RecetasPage() {
  const [recetas, setRecetas] = useState<any[]>([]);

  useEffect(() => {
    cargarRecetas();
  }, []);

  const cargarRecetas = async () => {
    const { data, error } = await supabase
      .from("recipes")
      .select("*");

    console.log(data);
    console.log(error);

    if (data) {
      setRecetas(data);
    }
  };

  return (
    <div>
      <h1>Recetas</h1>

      {recetas.map((receta) => (
        <div key={receta.id}>
          <h2>{receta.title}</h2>

          <p>{receta.description}</p>

          <hr />
        </div>
      ))}
    </div>
  );
}