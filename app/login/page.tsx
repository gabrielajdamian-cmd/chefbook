'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../lib/supabase'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()
  

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (error) {
      setError(error.message)
      return
    }

    router.push('/dashboard')
    router.refresh()
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '400px', margin: '0 auto' }}>
      <h1>Iniciar Sesión</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Correo"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ width: '100%', padding: '0.5rem', marginBottom: '0.5rem' }}
        />
        <br />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{ width: '100%', padding: '0.5rem', marginBottom: '0.5rem' }}
        />
        <br />
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button
          type="submit"
          style={{ padding: '0.5rem 1.5rem', backgroundColor: 'green', color: 'white', border: 'none', borderRadius: '4px', marginTop: '1rem' }}
        >
          Ingresar
        </button>
      </form>
      <p style={{ marginTop: '1rem' }}>
        ¿No tienes cuenta? <a href="/register" style={{ color: 'green' }}>Regístrate aquí</a>
      </p>
    </div>
  )
}