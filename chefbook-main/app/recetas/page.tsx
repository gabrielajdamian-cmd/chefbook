"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

type Receta = {
  id: string;
  nombre: string;
  ingredientes: string;
  pasos: string;
  tiempo_minutos?: number;
};

export default function RecetasPage() {
  const [usuario, setUsuario] = useState<any>(null);
  const [recetas, setRecetas] = useState<Receta[]>([]);
  const [nombre, setNombre] = useState("");
  const [ingredientes, setIngredientes] = useState("");
  const [pasos, setPasos] = useState("");
  const [tiempo, setTiempo] = useState("");
  const [formAbierto, setFormAbierto] = useState(false);
  const router = useRouter();

  // 🔒 Proteger página y cargar datos
  useEffect(() => {
    const verificarSesion = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login");
        return;
      }
      setUsuario(user);
      cargarRecetas(user.id);
    };
    verificarSesion();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session) router.push("/login");
    });
    return () => subscription.unsubscribe();
  }, [router]);

  // 📋 Cargar recetas
  const cargarRecetas = async (usuarioId: string) => {
    const { data, error } = await supabase
      .from("recetas")
      .select("id, nombre, ingredientes, pasos, tiempo_minutos")
      .eq("usuario_id", usuarioId)
      .order("creada_en", { ascending: false });

    if (!error && data) setRecetas(data);
  };

  // ➕ Guardar receta nueva
  const guardarReceta = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre || !ingredientes || !pasos) {
      alert("⚠️ Completa al menos Nombre, Ingredientes y Pasos");
      return;
    }

    const { error } = await supabase.from("recetas").insert([
      {
        nombre,
        ingredientes,
        pasos,
        tiempo_minutos: tiempo ? parseInt(tiempo) : null,
        usuario_id: usuario.id
      }
    ]);

    if (error) {
      alert("❌ Error: " + error.message);
      return;
    }

    alert("✅ ¡Receta guardada con éxito! 🎉");
    setNombre("");
    setIngredientes("");
    setPasos("");
    setTiempo("");
    setFormAbierto(false);
    cargarRecetas(usuario.id);
  };

  // 🚪 Cerrar sesión
  const cerrarSesion = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  if (!usuario) return <div style={estilos.cargando}>Cargando...</div>;

  return (
    <div style={estilos.contenedorGeneral}>
      
      {/* Barra de navegación superior */}
      <header style={estilos.barraSuperior}>
        <div style={estilos.bienvenida}>
          <span style={estilos.iconoBienvenida}>👩‍🍳</span>
          <div>
            <h2 style={estilos.textoBienvenida}>¡Bienvenida!</h2>
            <p style={estilos.correoUsuario}>{usuario.email}</p>
          </div>
        </div>
        <button 
          onClick={cerrarSesion}
          style={estilos.botonCerrarSesion}
          onMouseOver={(e) => {
            e.currentTarget.style.backgroundColor = "#c0392b";
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor = "#e74c3c";
          }}
        >
          🚪 Cerrar Sesión
        </button>
      </header>

      {/* Contenido principal */}
      <main style={estilos.contenido}>
        <div style={estilos.tarjetaPrincipal}>
          <h1 style={estilos.tituloPrincipal}>📖 Mi Libro de Recetas</h1>
          
          {/* Botón para mostrar/ocultar formulario */}
          <button 
            onClick={() => setFormAbierto(!formAbierto)}
            style={estilos.botonAgregar}
          >
            {formAbierto ? "✖ Cancelar" : "➕ Agregar Receta"}
          </button>

          {/* Formulario para agregar receta */}
          {formAbierto && (
            <form onSubmit={guardarReceta} style={estilos.formulario}>
              <h3 style={{marginTop:0, color:"#8b4513"}}>🍳 Nueva Receta</h3>
              
              <label style={estilos.etiqueta}>Nombre de la receta *</label>
              <input
                type="text"
                placeholder="Ej: Torta de Vainilla"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                required
                style={estilos.campo}
              />

              <label style={estilos.etiqueta}>⏱️ Tiempo en minutos</label>
              <input
                type="number"
                placeholder="Ej: 45"
                value={tiempo}
                onChange={(e) => setTiempo(e.target.value)}
                style={{...estilos.campo, width:"100px"}}
              />

              <label style={estilos.etiqueta}>🥗 Ingredientes *</label>
              <textarea
                placeholder="Escribe los ingredientes separados por comas..."
                value={ingredientes}
                onChange={(e) => setIngredientes(e.target.value)}
                required
                style={{...estilos.campo, minHeight:"100px", resize:"vertical"}}
              />

              <label style={estilos.etiqueta}>📝 Preparación *</label>
              <textarea
                placeholder="Describe paso a paso cómo prepararla..."
                value={pasos}
                onChange={(e) => setPasos(e.target.value)}
                required
                style={{...estilos.campo, minHeight:"120px", resize:"vertical"}}
              />

              <button type="submit" style={estilos.botonGuardar}>
                ✅ Guardar Receta
              </button>
            </form>
          )}

          {/* Listado de recetas */}
          <div style={{marginTop:"2.5rem"}}>
            <h2 style={{fontSize:"1.25rem", color:"#8b4513", marginBottom:"1rem"}}>📋 Tus Recetas</h2>
            
            {recetas.length === 0 ? (
              <div style={estilos.tarjetaVacia}>
                <span style={estilos.iconoGrande}>🍽️</span>
                <p style={estilos.textoVacio}>No tienes recetas guardadas todavía.<br />¡Sé la primera en agregar una! 💜</p>
              </div>
            ) : (
              recetas.map((receta) => (
                <div key={receta.id} style={estilos.tarjetaReceta}>
                  <h3 style={{color:"#8b4513", marginTop:0, marginBottom:"0.5rem"}}>
                    {receta.nombre}
                    {receta.tiempo_minutos && (
                      <span style={{fontSize:"0.85rem", color:"#e67e22", marginLeft:"0.75rem"}}>
                        ⏱️ {receta.tiempo_minutos} min
                      </span>
                    )}
                  </h3>
                  <p style={estilos.etiqueta}>🥗 Ingredientes:</p>
                  <p style={{color:"#555", whiteSpace:"pre-line"}}>{receta.ingredientes}</p>
                  <p style={estilos.etiqueta}>📝 Preparación:</p>
                  <p style={{color:"#555", whiteSpace:"pre-line"}}>{receta.pasos}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

// 🎨 Estilos profesionales
const estilos = {
  contenedorGeneral: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #fff9f0 0%, #fff5e6 100%)",
    fontFamily: "'Segoe UI', Roboto, sans-serif",
    padding: "0",
    margin: "0"
  },
  barraSuperior: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "1.25rem 2.5rem",
    backgroundColor: "#ffffff",
    boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
    marginBottom: "2rem"
  },
  bienvenida: {
    display: "flex",
    alignItems: "center",
    gap: "1rem"
  },
  iconoBienvenida: {
    fontSize: "2.5rem"
  },
  textoBienvenida: {
    margin: 0,
    fontSize: "1.15rem",
    color: "#2c3e50",
    fontWeight: 600
  },
  correoUsuario: {
    margin: "0.25rem 0 0 0",
    fontSize: "0.9rem",
    color: "#7f8c8d"
  },
  botonCerrarSesion: {
    padding: "0.75rem 1.75rem",
    backgroundColor: "#e74c3c",
    color: "#ffffff",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
    fontSize: "0.95rem",
    fontWeight: 500,
    transition: "all 0.3s ease",
    boxShadow: "0 3px 6px rgba(231, 76, 60, 0.25)"
  },
  contenido: {
    maxWidth: "900px",
    margin: "0 auto",
    padding: "0 2rem"
  },
  tarjetaPrincipal: {
    backgroundColor: "#ffffff",
    borderRadius: "16px",
    padding: "2.5rem",
    boxShadow: "0 6px 20px rgba(0,0,0,0.06)"
  },
  tituloPrincipal: {
    fontSize: "1.8rem",
    color: "#8b4513",
    margin: "0 0 1rem 0",
    borderBottom: "2px solid #f3e5d0",
    paddingBottom: "0.75rem"
  },
  botonAgregar: {
    padding: "0.75rem 1.5rem",
    backgroundColor: "#27ae60",
    color: "white",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
    fontSize: "0.95rem",
    fontWeight: 500,
    marginBottom: "1.5rem"
  },
  formulario: {
    backgroundColor: "#fef9f2",
    padding: "1.5rem",
    borderRadius: "12px",
    marginBottom: "2rem",
    border: "2px solid #f3e5d0"
  },
  etiqueta: {
    display: "block",
    marginTop: "1rem",
    marginBottom: "0.4rem",
    fontWeight: 500,
    color: "#6b4226"
  },
  campo: {
    width: "100%",
    padding: "0.75rem",
    border: "1px solid #e0c9a6",
    borderRadius: "8px",
    fontSize: "15px",
    backgroundColor: "#fffbf5"
  },
  botonGuardar: {
    marginTop: "1.25rem",
    padding: "0.75rem 2rem",
    backgroundColor: "#f39c12",
    color: "white",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
    fontSize: "1rem",
    fontWeight: 600,
    width: "100%"
  },
  tarjetaVacia: {
    textAlign: "center" as const,
    padding: "3rem",
    backgroundColor: "#fef9f2",
    borderRadius: "12px",
    border: "2px dashed #f0e2cc"
  },
  iconoGrande: {
    fontSize: "4rem",
    display: "block",
    marginBottom: "1rem"
  },
  textoVacio: {
    fontSize: "1rem",
    color: "#a08060",
    lineHeight: "1.6"
  },
  tarjetaReceta: {
    backgroundColor: "#fef9f2",
    padding: "1.25rem",
    borderRadius: "10px",
    marginBottom: "1rem",
    borderLeft: "4px solid #e67e22"
  },
  cargando: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    fontSize: "1.2rem",
    color: "#8b4513"
  } as const
};