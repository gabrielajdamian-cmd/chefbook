'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

interface ApiRecipe {
  idMeal: string
  strMeal: string
  strMealThumb: string
}

export default function RecetasPage() {
  const [apiRecipes, setApiRecipes] = useState<ApiRecipe[]>([])
  const [recetasLocales, setRecetasLocales] = useState<any[]>([])
  const [userId, setUserId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // 1. Obtener el usuario activo de Supabase
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) setUserId(data.user.id)
    })

    // 2. Cargar datos
    cargarTodasLasRecetas()
  }, [])

  const cargarTodasLasRecetas = async () => {
    setLoading(true)
    try {
      // Cargar desde la API Externa
      const res = await fetch("https://www.themealdb.com/api/json/v1/1/filter.php?c=Seafood")
      if (res.ok) {
        const data = await res.json()
        setApiRecipes(data.meals || [])
      }

      // Cargar desde Supabase
      const { data: locales } = await supabase.from('recetas').select('*')
      if (locales) setRecetasLocales(locales)
    } catch (err) {
      console.error("Error al cargar recetas:", err)
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
      // Actualizar la lista local inmediatamente
      const { data: locales } = await supabase.from('recetas').select('*')
      if (locales) setRecetasLocales(locales)
    }
  }

  if (loading) {
    return <div style={{ padding: '20px', textAlign: 'center' }}>Cargando catálogo...</div>
  }

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      {/* SECCIÓN 1: RECETAS DESDE SUPABASE */}
      <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '15px' }}>
        Mis Recetas Creadas (Supabase)
      </h1>

      {recetasLocales.length === 0 ? (
        <p style={{ color: '#666', marginBottom: '30px' }}>No hay recetas creadas en la base de datos local.</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px', marginBottom: '40px' }}>
          {recetasLocales.map((receta) => {
            // Detectar nombre e imagen dinámicamente según la columna
            const titulo = receta.titulo || receta.nombre || receta.title || 'Receta sin título'
            const imagen = receta.imagen_url || receta.imagen || receta.image_url || receta.photo

            // Permite borrar si coincide el usuario o si no tiene asignado un user_id
            const puedeEliminar = !receta.user_id || (userId && receta.user_id === userId)

            return (
              <div 
                key={receta.id} 
                style={{ 
                  border: '2px solid #10B981', 
                  borderRadius: '8px', 
                  padding: '12px', 
                  backgroundColor: '#ffffff', 
                  display: 'flex', 
                  flexDirection: 'column', 
                  justifyContent: 'space-between' 
                }}
              >
                <div>
                  {imagen ? (
                    <img 
                      src={imagen} 
                      alt={titulo} 
                      style={{ width: '100%', height: '120px', objectFit: 'cover', borderRadius: '6px', marginBottom: '8px' }} 
                    />
                  ) : (
                    <div style={{ width: '100%', height: '100px', backgroundColor: '#F3F4F6', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9CA3AF', fontSize: '12px', marginBottom: '8px' }}>
                      Sin imagen
                    </div>
                  )}

                  <p style={{ fontWeight: 'bold', fontSize: '14px', margin: '0 0 10px 0', color: '#1F2937' }}>
                    {titulo}
                  </p>
                </div>
                
                {puedeEliminar && (
                  <button 
                    onClick={() => handleEliminar(receta.id)}
                    style={{ 
                      width: '100%', 
                      backgroundColor: '#EF4444', 
                      color: '#ffffff', 
                      border: 'none', 
                      padding: '8px', 
                      borderRadius: '6px', 
                      cursor: 'pointer', 
                      fontWeight: '500', 
                      fontSize: '13px' 
                    }}
                  >
                    Eliminar receta
                  </button>
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* SECCIÓN 2: RECETAS DESDE LA API EXTERNA */}
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
