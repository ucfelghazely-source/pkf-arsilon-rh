'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Modal } from '@/components/ui/Modal'
import { useToast } from '@/components/ui/Toast'
import { soldeColor } from '@/lib/utils'

interface CPActionsProps {
  userId: string
  solde: number | null
}

export function CPActions({ userId, solde }: CPActionsProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [open, setOpen] = useState(false)
  const [start, setStart] = useState('2026-07-06')
  const [end, setEnd] = useState('2026-07-18')
  const [type, setType] = useState('CP')
  const [motif, setMotif] = useState('')
  const [loading, setLoading] = useState(false)

  function workingDays(s: string, e: string): number {
    let count = 0
    const cur = new Date(s)
    const endDt = new Date(e)
    while (cur <= endDt) {
      const dow = cur.getDay()
      if (dow !== 0 && dow !== 6) count++
      cur.setDate(cur.getDate() + 1)
    }
    return count
  }

  async function submit() {
    if (!start || !end) { toast('Sélectionnez les dates', 'error'); return }
    const days = workingDays(start, end)
    if (days <= 0) { toast('Dates invalides', 'error'); return }
    if (solde !== null && days > solde + 5) {
      toast('⚠️ Jours demandés > solde disponible. Accord exceptionnel nécessaire.', 'warn')
    }
    setLoading(true)
    const res = await fetch('/api/leave-requests', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ startDate: start, endDate: end, leaveType: type, workingDays: days, reason: motif }),
    })
    setLoading(false)
    if (res.ok) {
      setOpen(false)
      toast('✅ Demande CP soumise — en attente de validation', 'success')
      router.refresh()
    } else {
      const d = await res.json()
      toast(d.error ?? 'Erreur', 'error')
    }
  }

  const days = workingDays(start, end)

  return (
    <>
      <button className="btn btn-primary" onClick={() => setOpen(true)}>
        + Demander des congés
      </button>

      {open && (
        <Modal
          title="Nouvelle demande de congés"
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
              <label>Date de début</label>
              <input type="date" value={start} onChange={e => setStart(e.target.value)} />
            </div>
            <div className="fg">
              <label>Date de fin</label>
              <input type="date" value={end} onChange={e => setEnd(e.target.value)} />
            </div>
          </div>
          <div className="form-grid" style={{ marginTop: 12 }}>
            <div className="fg">
              <label>Type de congé</label>
              <select value={type} onChange={e => setType(e.target.value)}>
                <option value="CP">Congé Payé (CP)</option>
                <option value="RTT">RTT</option>
                <option value="SANS_SOLDE">Sans Solde (CSS)</option>
                <option value="EVENEMENT_FAMILIAL">Événement familial</option>
                <option value="RECUPERATION_FERIE">Récupération jour férié</option>
              </select>
            </div>
            <div className="fg">
              <label>Demi-journée</label>
              <select>
                <option value="">Journée complète</option>
                <option value="AM">Matin (AM)</option>
                <option value="PM">Après-midi (PM)</option>
              </select>
            </div>
          </div>
          <div className="fg" style={{ marginTop: 12 }}>
            <label>Motif / Commentaire</label>
            <textarea value={motif} onChange={e => setMotif(e.target.value)} placeholder="Précisez si besoin..." />
          </div>
          <div style={{ marginTop: 12, background: 'var(--surface)', borderRadius: 8, padding: 10, fontSize: 12 }}>
            <strong>
              {days > 0 && `${days}j ouvrés · `}
              Solde disponible : <span style={{ color: soldeColor(solde) }}>{solde ?? '?'}j</span>
            </strong>
            {solde !== null && solde < 5 && (
              <span style={{ color: 'var(--amber)', marginLeft: 8 }}>⚠️ Solde faible</span>
            )}
          </div>
        </Modal>
      )}
    </>
  )
}
