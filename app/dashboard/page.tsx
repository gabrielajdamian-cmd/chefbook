'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../lib/supabase'

export default function DashboardPage() {
  const [usuario, setUsuario] = useState<any>(null)
  const [rol, setRol] = useState('')
  const router = useRouter()

  useEffect(() => {
    async function cargarDatos() {
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session) {
        router.push('/login')
        return
      }

      setUsuario(session.user)

      const { data } = await supabase
        .from('profiles')
        .select('role, full_name')
        .eq('id', session.user.id)
        .single()

      if (data) {
        setRol(data.role)
      }
    }

    cargarDatos()
  }, [supabase, router])

  async function cerrarSesion() {
    await supabase.auth.signOut()
    router.push('/')
  }

  if (!usuario) return <p className="text-center mt-10">Cargando...</p>

  return (
    <main style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto' }}>
      <h1> Bienvenido, {usuario?.email}</h1>
      
      <div style={{ padding: '1rem', backgroundColor: '#f0fdf4', borderRadius: '8px', margin: '1rem 0' }}>
        <p><strong>Rol:</strong> {rol === 'chef' ? '🧑‍🍳 Chef' : '👤 Lector'}</p>
        <p><strong>Correo:</strong> {usuario?.email}</p>
      </div>

      {rol === 'chef' && (
        <div style={{ margin: '1rem 0' }}>
          <a 
            href="/dashboard/nuevo" 
            style={{ padding: '0.5rem 1rem', backgroundColor: '#16a34a', color: 'white', borderRadius: '4px', textDecoration: 'none' }}
          >
             Publicar nueva receta
          </a>
        </div>
      )}

      <button
        onClick={cerrarSesion}
        style={{ padding: '0.5rem 1rem', backgroundColor: '#ef4444', color: 'white', border: 'none', borderRadius: '4px', marginTop: '1rem' }}
      >
        Cerrar Sesión
      </button>
    </main>
  )
}