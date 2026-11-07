'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Modal } from '@/components/ui/Modal'
import { useToast } from '@/components/ui/Toast'

interface Form {
  id: string
  icon: string
  title: string
  sub: string
  color: string
}

export function FormsClient({ forms }: { forms: Form[] }) {
  const router = useRouter()
  const { toast } = useToast()
  const [selected, setSelected] = useState<Form | null>(null)
  const [note, setNote] = useState('')
  const [dest, setDest] = useState('Organisme bancaire')
  const [loading, setLoading] = useState(false)

  async function submit() {
    if (!selected) return
    setLoading(true)
    const res = await fetch('/api/admin-requests', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: selected.id, payload: { note, dest } }),
    })
    setLoading(false)
    if (res.ok) {
      setSelected(null)
      setNote('')
      toast(`✅ Demande "${selected.title}" soumise au service RH`, 'success')
      router.refresh()
    } else {
      toast('Erreur lors de la soumission', 'error')
    }
  }

  return (
    <>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(150px,1fr))', gap: 12 }}>
        {forms.map(f => (
          <div
            key={f.id}
            className="card"
            style={{ cursor: 'pointer', textAlign: 'center', padding: '20px 12px' }}
            onClick={() => setSelected(f)}
          >
            <div style={{ fontSize: 28, marginBottom: 8 }}>{f.icon}</div>
            <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text)' }}>{f.title}</div>
            <div style={{ fontSize: 11, color: 'var(--text3)', marginTop: 3 }}>{f.sub}</div>
            <div style={{ marginTop: 12, fontSize: 22, color: f.color, fontWeight: 300 }}>+</div>
          </div>
        ))}
      </div>

      {selected && (
        <Modal
          title={selected.title}
          onClose={() => setSelected(null)}
          footer={
            <>
              <button className="btn btn-ghost" onClick={() => setSelected(null)}>Annuler</button>
              <button className="btn btn-primary" onClick={submit} disabled={loading}>
                {loading ? '⏳' : '✉️'} Soumettre
              </button>
            </>
          }
        >
          <div className="fg">
            <label>Commentaire / Précisions</label>
            <textarea value={note} onChange={e => setNote(e.target.value)} placeholder="Détaillez votre demande..." />
          </div>
          {selected.id === 'ATTESTATION_TRAVAIL' && (
            <>
              <div className="fg" style={{ marginTop: 12 }}>
                <label>Destinataire</label>
                <select value={dest} onChange={e => setDest(e.target.value)}>
                  <option>Organisme bancaire</option>
                  <option>Administration publique</option>
                  <option>Ambassade</option>
                  <option>Autre</option>
                </select>
              </div>
              <div className="alert alert-info" style={{ marginTop: 12 }}>
                <span>ℹ️</span>
                L&apos;attestation sera générée en PDF et disponible sous 24h.
              </div>
            </>
          )}
        </Modal>
      )}
    </>
  )
}
