'use client'
import { useState } from 'react'
import { useToast } from '@/components/ui/Toast'

export function ImportClient() {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)

  function simulate() {
    setLoading(true)
    toast('⏳ Import en cours…', 'info')
    setTimeout(() => {
      setLoading(false)
      toast('✅ 17 collaborateurs importés · 0 erreur', 'success')
    }, 1500)
  }

  return (
    <div
      className="card"
      style={{ border: '2px dashed var(--blue-br)', textAlign: 'center', padding: '40px 20px' }}
    >
      <div style={{ fontSize: 40, marginBottom: 12 }}>📊</div>
      <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--text)', marginBottom: 6 }}>
        Glissez votre fichier Excel ici
      </div>
      <div style={{ fontSize: 12, color: 'var(--text3)', marginBottom: 16 }}>
        Suivi_CP___Télétravail_Casablanca.xlsx · Format accepté
      </div>
      <button className="btn btn-primary" onClick={simulate} disabled={loading}>
        {loading ? '⏳ Import en cours…' : '📂 Choisir un fichier'}
      </button>
    </div>
  )
}
