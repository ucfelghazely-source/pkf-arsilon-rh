'use client'
import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export default function LoginForm() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const res = await signIn('credentials', {
      email,
      password,
      redirect: false,
    })

    setLoading(false)

    if (res?.error) {
      setError('Email ou mot de passe incorrect.')
    } else {
      router.push('/dashboard')
      router.refresh()
    }
  }

  return (
    <div className="login-wrap">
      <div className="login-card">
        <div className="login-logo">
          <div className="big">PKF <span>Arsilon</span></div>
          <div className="sub">Plateforme RH · Bureau de Casablanca</div>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div className="fg">
            <label>Adresse email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="prenom.nom@arsilon.com"
              required
              autoComplete="email"
              autoFocus
            />
          </div>

          <div className="fg">
            <label>Mot de passe</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              autoComplete="current-password"
            />
          </div>

          {error && (
            <div className="alert alert-error">
              <span className="alert-icon">❌</span>
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', justifyContent: 'center', padding: '10px 16px', marginTop: 4 }}
            disabled={loading}
          >
            {loading ? '⏳ Connexion…' : '🔑 Se connecter'}
          </button>
        </form>

        <div style={{ marginTop: 24, padding: '12px 14px', background: 'var(--surface)', borderRadius: 10, border: '0.5px solid var(--border)' }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text3)', marginBottom: 6 }}>
            ACCÈS RESTREINT
          </div>
          <div style={{ fontSize: 12, color: 'var(--text2)' }}>
            Cette plateforme est réservée au personnel autorisé du bureau PKF Arsilon Casablanca.
          </div>
        </div>
      </div>
    </div>
  )
}
