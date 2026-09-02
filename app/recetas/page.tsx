'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

interface ApiRecipe {
  idMeal: string
  strMeal: string
  strMealThumb: string
}

export default function RecetasPage() {
  const [apiRecipes, setApiRecipes] = useState<ApiRecipe[]>([])
  const [recetasLocales, setRecetasLocales] = useState<any[]>([])
  const [rolUsuario, setRolUsuario] = useState<string>("Lector")
  const [userId, setUserId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // 1. Verificar sesión y ROL del usuario
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        setUserId(data.user.id)
        // Lee el rol guardado en el registro ("Chef" o "Lector")
        setRolUsuario(data.user.user_metadata?.rol || "Lector")
      }
    })

    // 2. Cargar recetas
    cargarTodasLasRecetas()
  }, [])

  const cargarTodasLasRecetas = async () => {
    setLoading(true)
    try {
      const res = await fetch("https://www.themealdb.com/api/json/v1/1/filter.php?c=Seafood")
      if (res.ok) {
        const data = await res.json()
        setApiRecipes(data.meals || [])
      }

      const { data: locales } = await supabase.from('recetas').select('*')
      if (locales) setRecetasLocales(locales)
    } catch (err) {
      console.error("Error al cargar recetas:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleEliminar = async (id: string) => {
    if (rolUsuario !== "Chef") {
      alert("Los lectores no tienen permiso para eliminar recetas.")
      return
    }

    if (!confirm('¿Deseas eliminar esta receta?')) return

    const { error } = await supabase.from('recetas').delete().eq('id', id)

    if (error) {
      alert('Error al eliminar: ' + error.message)
    } else {
      alert('Receta eliminada correctamente')
      cargarTodasLasRecetas()
    }
  }

  if (loading) {
    return <div style={{ padding: '20px', textAlign: 'center' }}>Cargando catálogo...</div>
  }

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      
      {/* CABECERA: El botón "+ Crear Nueva Receta" SOLO se muestra al Chef */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold', margin: 0 }}>
          Mis Recetas Creadas (Supabase)
        </h1>

        {rolUsuario === "Chef" && (
          <Link 
            href="/dashboard/nuevo" 
            style={{ 
              backgroundColor: '#10B981', 
              color: '#ffffff', 
              padding: '10px 16px', 
              borderRadius: '6px', 
              textDecoration: 'none', 
              fontWeight: 'bold', 
              fontSize: '14px' 
            }}
          >
            + Crear Nueva Receta
          </Link>
        )}
      </div>

      {/* SECCIÓN RECETAS LOCALES */}
      {recetasLocales.length === 0 ? (
        <p style={{ color: '#666', marginBottom: '30px' }}>No hay recetas registradas.</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '20px', marginBottom: '40px' }}>
          {recetasLocales.map((receta) => {
            const titulo = receta.nombre || receta.titulo || 'Receta sin título'
            const imagen = receta.imagen_url || receta.imagen

            return (
              <div 
                key={receta.id} 
                style={{ 
                  border: '1px solid #E5E7EB', 
                  borderRadius: '8px', 
                  padding: '12px', 
                  backgroundColor: '#ffffff', 
                  display: 'flex', 
                  flexDirection: 'column', 
                  justify: 'space-between' 
                }}
              >
                <div>
                  {imagen ? (
                    <img 
                      src={imagen} 
                      alt={titulo} 
                      style={{ width: '100%', height: '140px', objectFit: 'cover', borderRadius: '6px', marginBottom: '8px' }} 
                    />
                  ) : (
                    <div style={{ width: '100%', height: '140px', backgroundColor: '#F3F4F6', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9CA3AF', fontSize: '12px', marginBottom: '8px' }}>
                      Sin imagen
                    </div>
                  )}

                  <p style={{ fontWeight: 'bold', fontSize: '14px', margin: '0 0 10px 0', color: '#1F2937' }}>
                    {titulo}
                  </p>
                </div>
                
                {/* BOTONERA: Solo visible si el rol es "Chef" */}
                {rolUsuario === "Chef" && (
                  <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
                    <Link 
                      href={`/dashboard/editar/${receta.id}`} 
                      style={{ 
                        flex: 1, 
                        textAlign: 'center', 
                        backgroundColor: '#10B981', 
                        color: '#ffffff', 
                        padding: '8px 4px', 
                        borderRadius: '6px', 
                        textDecoration: 'none', 
                        fontSize: '12px', 
                        fontWeight: 'bold' 
                      }}
                    >
                      Editar
                    </Link>

                    <button 
                      onClick={() => handleEliminar(receta.id)}
                      style={{ 
                        flex: 1, 
                        backgroundColor: '#EF4444', 
                        color: '#ffffff', 
                        border: 'none', 
                        padding: '8px 4px', 
                        borderRadius: '6px', 
                        cursor: 'pointer', 
                        fontWeight: 'bold', 
                        fontSize: '12px' 
                      }}
                    >
                      Eliminar
                    </button>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* SECCIÓN API EXTERNA (Lectura pública) */}
      <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '15px', color: '#4B5563' }}>
        Explorar Recetas Globales (TheMealDB)
      </h2>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px' }}>
        {apiRecipes.map((receta) => (
          <div key={receta.idMeal} style={{ border: '1px solid #ccc', borderRadius: '8px', overflow: 'hidden' }}>
            <img 
              src={receta.strMealThumb} 
              alt={receta.strMeal} 
              style={{ width: '100%', height: '150px', objectFit: 'cover' }} 
            />
            <p style={{ padding: '10px', fontWeight: 'bold', fontSize: '14px', margin: 0 }}>
              {receta.strMeal}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}