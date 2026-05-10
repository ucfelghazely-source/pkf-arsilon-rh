'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Modal } from '@/components/ui/Modal'
import { useToast } from '@/components/ui/Toast'

interface Props {
  userId: string
  userName: string
  balance: {
    balanceStart: number
    acquired: number
    consumed: number
    publicHolidayWorked: number
  }
}

export function AdminActions({ userId, userName, balance }: Props) {
  const router = useRouter()
  const { toast } = useToast()
  const [open, setOpen] = useState(false)
  const [n1, setN1] = useState(balance.balanceStart.toString())
  const [acq, setAcq] = useState(balance.acquired.toString())
  const [cons, setCons] = useState(balance.consumed.toString())
  const [jf, setJf] = useState(balance.publicHolidayWorked.toString())
  const [loading, setLoading] = useState(false)

  async function save() {
    setLoading(true)
    const res = await fetch(`/api/balances/${userId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        balanceStart: +n1,
        acquired: +acq,
        consumed: +cons,
        publicHolidayWorked: +jf,
        fiscalYear: 'FY26',
        leaveType: 'CP',
      }),
    })
    setLoading(false)
    if (res.ok) {
      setOpen(false)
      toast('✅ Solde mis à jour', 'success')
      router.refresh()
    } else {
      toast('Erreur', 'error')
    }
  }

  return (
    <>
      <button className="btn btn-ghost btn-sm" onClick={() => setOpen(true)}>
        ✏️ Modifier
      </button>

      {open && (
        <Modal
          title={`Modifier solde — ${userName}`}
          onClose={() => setOpen(false)}
          footer={
            <>
              <button className="btn btn-ghost" onClick={() => setOpen(false)}>Annuler</button>
              <button className="btn btn-primary" onClick={save} disabled={loading}>
                💾 Enregistrer
              </button>
            </>
          }
        >
          <div className="form-grid">
            <div className="fg">
              <label>Solde N-1</label>
              <input type="number" value={n1} onChange={e => setN1(e.target.value)} step="0.5" />
            </div>
            <div className="fg">
              <label>CP acquis FY26</label>
              <input type="number" value={acq} onChange={e => setAcq(e.target.value)} step="0.5" />
            </div>
            <div className="fg">
              <label>CP consommés</label>
              <input type="number" value={cons} onChange={e => setCons(e.target.value)} step="0.5" />
            </div>
            <div className="fg">
              <label>JF Maroc travaillés</label>
              <input type="number" value={jf} onChange={e => setJf(e.target.value)} step="1" />
            </div>
          </div>
        </Modal>
      )}
    </>
  )
}
