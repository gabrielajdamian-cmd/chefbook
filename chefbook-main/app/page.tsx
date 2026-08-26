import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center p-8 relative overflow-hidden"
          style={{ background: "linear-gradient(135deg, #FFE5E5 0%, #FFF4E5 50%, #FFF9E5 100%)" }}>
      
      {/* Tu imagen de fondo abajo y suave */}
      <div 
        className="absolute bottom-2 left-1/2 translate-x-[-50%] z-0 pointer-events-none"
        style={{ opacity: 0.15 }}
      >
        <img 
          src="/comic.jpeg"
          alt="Gaby's chefbook"
          style={{ width: "300px", height: "auto" }}
        />
      </div>
      
      <h1 className="text-5xl font-bold mb-4 mt-12 z-10" style={{ color: "#8B4513" }}>
        Gaby's Kitchen
      </h1>
      
      <p className="text-xl mb-10 z-10" style={{ color: "#6B5B4F" }}>
        Tu libro de recetas favorito 
      </p>
      
      <div className="flex flex-col sm:flex-row gap-4 mt-4 z-10">
        <Link href="/recetas" 
              className="px-8 py-4 rounded-full text-lg font-medium shadow-md transition-transform hover:scale-105 text-center"
              style={{ background: "#FFD4B8", color: "#7A3E28" }}>
          📖 Ver Recetas
        </Link>
        
        <Link href="/login" 
              className="px-8 py-4 rounded-full text-lg font-medium shadow-md transition-transform hover:scale-105 text-center"
              style={{ background: "#B8E0FF", color: "#2A4B7C" }}>
           Iniciar Sesión
        </Link>
      </div>

      {/* BOTÓN NUEVO DE REGISTRO */}
      <div className="mt-4 z-10">
        <Link href="/register" 
              className="px-8 py-3 rounded-full text-lg font-medium shadow-md transition-transform hover:scale-105 inline-block"
              style={{ background: "#C8FFC8", color: "#286628" }}>
           Registrarse
        </Link>
      </div>
      
      <p className="mt-12 text-sm z-10" style={{ color: "#9A8B7D" }}>
        Recetas hechas con amor 
      </p>
    </main>
  );
}