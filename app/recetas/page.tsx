'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

interface ApiRecipe {
  idMeal: string
  strMeal: string
  strMealThumb: string
}

// Tipo flexible para las recetas de Supabase
interface RecetaLocal {
  id: string
  nombre?: string
  titulo?: string
  imagen_url?: string
  imagen?: string
  ingredientes?: string
  preparacion?: string
  instrucciones?: string
  pasos?: string
  tiempo_preparacion?: string
  tiempo?: string
}

export default function RecetasPage() {
  const [apiRecipes, setApiRecipes] = useState<ApiRecipe[]>([])
  const [recetasLocales, setRecetasLocales] = useState<RecetaLocal[]>([])
  const [rolUsuario, setRolUsuario] = useState<string>("Lector")
  const [loading, setLoading] = useState(true)
  
  // Estado para el modal de detalle
  const [recetaSeleccionada, setRecetaSeleccionada] = useState<RecetaLocal | null>(null)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        setRolUsuario(data.user.user_metadata?.rol || "Lector")
      }
    })

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
      if (locales) setRecetasLocales(locales as RecetaLocal[])
    } catch (err) {
      console.error("Error al cargar recetas:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleEliminar = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
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
    return <div style={{ padding: '20px', textAlign: 'center' }}>Cargando recetas...</div>
  }

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      
      {/* CABECERA */}
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

      {/* RECETAS LOCALES */}
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
                onClick={() => setRecetaSeleccionada(receta)}
                style={{ 
                  border: '1px solid #E5E7EB', 
                  borderRadius: '8px', 
                  padding: '12px', 
                  backgroundColor: '#ffffff', 
                  display: 'flex', 
                  flexDirection: 'column', 
                  justify: 'space-between',
                  cursor: 'pointer',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
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

                {rolUsuario === "Chef" && (
                  <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }} onClick={(e) => e.stopPropagation()}>
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
                      onClick={(e) => handleEliminar(receta.id, e)}
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

      {/* VENTANA EMERGENTE (MODAL) */}
      {recetaSeleccionada && (
        <div 
          onClick={() => setRecetaSeleccionada(null)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px'
          }}
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '12px',
              maxWidth: '500px',
              width: '100%',
              maxHeight: '85vh',
              overflowY: 'auto',
              padding: '24px',
              position: 'relative',
              boxShadow: '0 10px 25px rgba(0,0,0,0.2)'
            }}
          >
            <button 
              onClick={() => setRecetaSeleccionada(null)}
              style={{
                position: 'absolute',
                top: '12px',
                right: '16px',
                border: 'none',
                background: 'none',
                fontSize: '20px',
                fontWeight: 'bold',
                cursor: 'pointer',
                color: '#6B7280'
              }}
            >
              ✕
            </button>

            {(recetaSeleccionada.imagen_url || recetaSeleccionada.imagen) && (
              <img 
                src={recetaSeleccionada.imagen_url || recetaSeleccionada.imagen} 
                alt={recetaSeleccionada.nombre || recetaSeleccionada.titulo} 
                style={{ width: '100%', height: '220px', objectFit: 'cover', borderRadius: '8px', marginBottom: '16px' }}
              />
            )}

            <h2 style={{ fontSize: '22px', fontWeight: 'bold', marginBottom: '8px', color: '#111827' }}>
              {recetaSeleccionada.nombre || recetaSeleccionada.titulo}
            </h2>

            {(recetaSeleccionada.tiempo_preparacion || recetaSeleccionada.tiempo) && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '16px', color: '#059669', fontSize: '14px', fontWeight: 'bold' }}>
                <span>⏱️ Tiempo de preparación:</span>
                <span>{recetaSeleccionada.tiempo_preparacion || recetaSeleccionada.tiempo}</span>
              </div>
            )}

            {recetaSeleccionada.ingredientes && (
              <div style={{ marginBottom: '16px' }}>
                <h3 style={{ fontSize: '15px', fontWeight: 'bold', color: '#374151', marginBottom: '6px' }}>
                  Ingredientes:
                </h3>
                <p style={{ fontSize: '14px', color: '#4B5563', whiteSpace: 'pre-line', margin: 0, lineHeight: '1.5' }}>
                  {recetaSeleccionada.ingredientes}
                </p>
              </div>
            )}

            {(recetaSeleccionada.preparacion || recetaSeleccionada.instrucciones || recetaSeleccionada.pasos) && (
              <div style={{ marginBottom: '10px' }}>
                <h3 style={{ fontSize: '15px', fontWeight: 'bold', color: '#374151', marginBottom: '6px' }}>
                  Preparación:
                </h3>
                <p style={{ fontSize: '14px', color: '#4B5563', whiteSpace: 'pre-line', margin: 0, lineHeight: '1.5' }}>
                  {recetaSeleccionada.preparacion || recetaSeleccionada.instrucciones || recetaSeleccionada.pasos}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* API EXTERNA */}
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