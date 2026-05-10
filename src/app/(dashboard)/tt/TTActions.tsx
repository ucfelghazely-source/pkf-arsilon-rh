'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Modal } from '@/components/ui/Modal'
import { useToast } from '@/components/ui/Toast'

interface TTActionsProps {
  userId: string
  week20Used: number
  cancelId?: string
}

function getISOWeek(d: Date): number {
  const date = new Date(d)
  date.setHours(0, 0, 0, 0)
  date.setDate(date.getDate() + 3 - ((date.getDay() + 6) % 7))
  const week1 = new Date(date.getFullYear(), 0, 4)
  return 1 + Math.round(((date.getTime() - week1.getTime()) / 86400000 - 3 + ((week1.getDay() + 6) % 7)) / 7)
}

export function TTActions({ userId, week20Used, cancelId }: TTActionsProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [open, setOpen] = useState(false)
  const [date, setDate] = useState('2026-05-19')
  const [motif, setMotif] = useState('')
  const [loading, setLoading] = useState(false)

  // Bouton annuler une demande en attente
  if (cancelId) {
    async function doCancel() {
      setLoading(true)
      const res = await fetch(`/api/remote-work/${cancelId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'cancel' }),
      })
      setLoading(false)
      if (res.ok) {
        toast('Demande annulée', 'info')
        router.refresh()
      } else {
        toast('Erreur lors de l\'annulation', 'error')
      }
    }
    return (
      <button className="btn btn-danger btn-sm" onClick={doCancel} disabled={loading}>
        Annuler
      </button>
    )
  }

  async function submit() {
    if (!date) { toast('Sélectionnez une date', 'error'); return }
    const dt = new Date(date)
    const week = getISOWeek(dt)
    setLoading(true)
    const res = await fetch('/api/remote-work', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ date, weekNumber: week, yearNumber: dt.getFullYear(), reason: motif }),
    })
    setLoading(false)
    if (res.ok) {
      setOpen(false)
      toast('✅ Demande TT soumise — en attente de validation manager', 'success')
      router.refresh()
    } else {
      const d = await res.json()
      toast(d.error ?? 'Erreur', 'error')
    }
  }

  return (
    <>
      <button className="btn btn-primary" onClick={() => setOpen(true)}>
        + Nouvelle demande
      </button>

      {open && (
        <Modal
          title="Nouvelle demande de télétravail"
          onClose={() => setOpen(false)}
          footer={
            <>
              <button className="btn btn-ghost" onClick={() => setOpen(false)}>Annuler</button>
              <button className="btn btn-primary" onClick={submit} disabled={loading}>
                {loading ? '⏳' : '✉️'} Soumettre
              </button>
            </>
          }
        >
          <div className="form-grid">
            <div className="fg">
              <label>Date souhaitée</label>
              <input type="date" value={date} onChange={e => setDate(e.target.value)} min="2026-05-11" />
            </div>
            <div className="fg">
              <label>Type</label>
              <select>
                <option>Régulier</option>
                <option>Occasionnel</option>
              </select>
            </div>
          </div>
          <div className="fg" style={{ marginTop: 12 }}>
            <label>Motif (optionnel)</label>
            <input type="text" value={motif} onChange={e => setMotif(e.target.value)} placeholder="Ex: Concentration sur dossier client" />
          </div>
          <div style={{ marginTop: 14, background: 'var(--surface)', borderRadius: 8, padding: 12 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text2)', marginBottom: 8 }}>Workflow de validation</div>
            <div className="wf">
              <div className="wf-step"><div className="wf-circle wf-done">✓</div><div className="wf-lbl">Soumis</div></div>
              <div className="wf-line done" />
              <div className="wf-step"><div className="wf-circle wf-active">2</div><div className="wf-lbl">Manager</div></div>
              <div className="wf-line" />
              <div className="wf-step"><div className="wf-circle wf-wait">3</div><div className="wf-lbl">RH</div></div>
              <div className="wf-line" />
              <div className="wf-step"><div className="wf-circle wf-wait">✓</div><div className="wf-lbl">Final</div></div>
            </div>
          </div>
          {week20Used >= 2 && (
            <div className="alert alert-warn" style={{ marginTop: 12 }}>
              <span>⚠️</span>
              Semaine S20 déjà à 2j — choisissez une autre semaine.
            </div>
          )}
        </Modal>
      )}
    </>
  )
}
