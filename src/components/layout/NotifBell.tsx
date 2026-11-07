'use client'
import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { Modal } from '../ui/Modal'

interface Notif {
  id: string
  title: string
  body: string
  type: string
  isRead: boolean
  createdAt: string
}

export function NotifBell() {
  const { data: session } = useSession()
  const [notifs, setNotifs] = useState<Notif[]>([])
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!session) return
    fetch('/api/notifications')
      .then(r => r.json())
      .then(d => setNotifs(d.notifications ?? []))
      .catch(() => {})
  }, [session])

  const unread = notifs.filter(n => !n.isRead).length

  async function openNotifs() {
    setOpen(true)
    if (unread > 0) {
      await fetch('/api/notifications', { method: 'PATCH' })
      setNotifs(prev => prev.map(n => ({ ...n, isRead: true })))
    }
  }

  const typeIcon: Record<string, string> = { TT: '💻', CP: '🏖️', ADM: '📋' }

  return (
    <>
      <button className="notif-btn" onClick={openNotifs} title="Notifications">
        🔔
        {unread > 0 && <div className="notif-dot" />}
      </button>

      {open && (
        <Modal
          title="🔔 Notifications"
          onClose={() => setOpen(false)}
          footer={
            <button className="btn btn-primary" onClick={() => setOpen(false)}>
              Fermer
            </button>
          }
        >
          {notifs.length === 0 ? (
            <p style={{ color: 'var(--text3)', textAlign: 'center', padding: '20px 0', fontSize: 13 }}>
              Aucune notification
            </p>
          ) : (
            notifs.map(n => (
              <div
                key={n.id}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 10,
                  padding: '8px 0',
                  borderBottom: '0.5px solid var(--border)',
                }}
              >
                <span style={{ fontSize: 18 }}>{typeIcon[n.type] ?? '📋'}</span>
                <div>
                  <p style={{ fontSize: 13, color: 'var(--text)', fontWeight: n.isRead ? 400 : 600 }}>
                    {n.body}
                  </p>
                </div>
              </div>
            ))
          )}
        </Modal>
      )}
    </>
  )
}
