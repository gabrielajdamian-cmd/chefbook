'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

interface ApiRecipe {
  idMeal: string
  strMeal: string
  strMealThumb: string
}

interface LocalRecipe {
  id: string
  titulo?: string
  nombre?: string
  imagen_url?: string
  user_id: string
}

export default function RecetasPage() {
  const [apiRecipes, setApiRecipes] = useState<ApiRecipe[]>([])
  const [recetasLocales, setRecetasLocales] = useState<LocalRecipe[]>([])
  const [userId, setUserId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // 1. Obtener usuario de Supabase
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) setUserId(data.user.id)
    })

    // 2. Cargar recetas de la API Externa y de Supabase en paralelo
    cargarTodasLasRecetas()
  }, [])

  const cargarTodasLasRecetas = async () => {
    setLoading(true)
    try {
      // Petición API Externa
      const res = await fetch("https://www.themealdb.com/api/json/v1/1/filter.php?c=Seafood")
      if (res.ok) {
        const data = await res.json()
        setApiRecipes(data.meals || [])
      }

      // Petición Supabase
      const { data: locales } = await supabase.from('recetas').select('*')
      if (locales) setRecetasLocales(locales)
    } catch (err) {
      console.error("Error cargando recetas:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleEliminar = async (id: string) => {
    if (!confirm('¿Deseas eliminar esta receta de tu catálogo local?')) return

    const { error } = await supabase
      .from('recetas')
      .delete()
      .eq('id', id)

    if (error) {
      alert('Error al eliminar: ' + error.message)
    } else {
      alert('Receta eliminada correctamente')
      // Refrescar lista local
      const { data: locales } = await supabase.from('recetas').select('*')
      if (locales) setRecetasLocales(locales)
    }
  }

  if (loading) {
    return <div style={{ padding: '20px', textAlign: 'center' }}>Cargando catálogo...</div>
  }

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      {/* SECCIÓN 1: RECETAS DE SUPABASE (CON OPCIÓN DE ELIMINAR SI ERES EL AUTOR) */}
      <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '15px' }}>
        Mis Recetas Creadas (Supabase)
      </h1>

      {recetasLocales.length === 0 ? (
        <p style={{ color: '#666', marginBottom: '30px' }}>No hay recetas creadas en la base de datos local.</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px', marginBottom: '40px' }}>
          {recetasLocales.map((receta) => (
            <div key={receta.id} style={{ border: '2px solid #10B981', borderRadius: '8px', overflow: 'hidden', padding: '10px' }}>
              {receta.imagen_url && (
                <img 
                  src={receta.imagen_url} 
                  alt={receta.titulo || receta.nombre} 
                  style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: '4px' }} 
                />
              )}
              <p style={{ fontWeight: 'bold', fontSize: '14px', margin: '10px 0' }}>
                {receta.titulo || receta.nombre}
              </p>
              
              {userId && receta.user_id === userId && (
                <button 
                  onClick={() => handleEliminar(receta.id)}
                  style={{ width: '100%', backgroundColor: '#EF4444', color: '#fff', border: 'none', padding: '8px', borderRadius: '4px', cursor: 'pointer' }}
                >
                  Eliminar mi receta
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* SECCIÓN 2: RECETAS EXTERNAS (SOLO LECTURA) */}
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