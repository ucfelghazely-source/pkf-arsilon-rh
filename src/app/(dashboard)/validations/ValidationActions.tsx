'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Modal } from '@/components/ui/Modal'
import { useToast } from '@/components/ui/Toast'

interface Props {
  requestId: string
  requestType: 'TT' | 'CP' | 'ADM'
}

export function ValidationActions({ requestId, requestType }: Props) {
  const router = useRouter()
  const { toast } = useToast()
  const [refuseOpen, setRefuseOpen] = useState(false)
  const [reason, setReason] = useState('')
  const [loading, setLoading] = useState(false)

  const endpoint =
    requestType === 'TT'
      ? `/api/remote-work/${requestId}`
      : requestType === 'CP'
      ? `/api/leave-requests/${requestId}`
      : `/api/admin-requests/${requestId}`

  async function approve() {
    setLoading(true)
    const res = await fetch(endpoint, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'approve' }),
    })
    setLoading(false)
    if (res.ok) {
      toast('✅ Demande approuvée', 'success')
      router.refresh()
    } else {
      const d = await res.json()
      toast(d.error ?? 'Erreur', 'error')
    }
  }

  async function refuse() {
    setLoading(true)
    const res = await fetch(endpoint, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'refuse', reason: reason || 'Refusé par le manager' }),
    })
    setLoading(false)
    if (res.ok) {
      setRefuseOpen(false)
      toast('Demande refusée', 'info')
      router.refresh()
    } else {
      toast('Erreur', 'error')
    }
  }

  return (
    <>
      <div style={{ marginTop: 10, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <button className="btn btn-green btn-sm" onClick={approve} disabled={loading}>
          ✅ Approuver
        </button>
        <button className="btn btn-danger btn-sm" onClick={() => setRefuseOpen(true)} disabled={loading}>
          ❌ Refuser
        </button>
      </div>

      {refuseOpen && (
        <Modal
          title="Motif de refus"
          onClose={() => setRefuseOpen(false)}
          footer={
            <>
              <button className="btn btn-ghost" onClick={() => setRefuseOpen(false)}>Annuler</button>
              <button className="btn btn-danger" onClick={refuse} disabled={loading}>
                ❌ Confirmer le refus
              </button>
            </>
          }
        >
          <div className="fg">
            <label>Raison du refus</label>
            <textarea
              value={reason}
              onChange={e => setReason(e.target.value)}
              placeholder="Ex: Conflit planning équipe, quota dépassé..."
            />
          </div>
        </Modal>
      )}
    </>
  )
}
