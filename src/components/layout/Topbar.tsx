'use client'
import { useSession, signOut } from 'next-auth/react'
import { NotifBell } from './NotifBell'

const ROLE_STYLES: Record<string, React.CSSProperties> = {
  COLLABORATEUR: { background: '#DBEAFE', color: '#1E40AF' },
  MANAGER:       { background: '#D1FAE5', color: '#065F46' },
  RH:            { background: '#EDE9FE', color: '#5B21B6' },
  ADMIN:         { background: '#FEE2E2', color: '#991B1B' },
}

export function Topbar() {
  const { data: session } = useSession()

  if (!session?.user) return null

  const u = session.user
  const color = u.avatarColor ?? '2563A8'
  const initials = (u.name ?? '--')
    .split(' ')
    .map(p => p[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  return (
    <div className="topbar">
      <div className="topbar-brand">
        <div className="logo">
          PKF <span>Arsilon</span>
          <span style={{ fontSize: 11, opacity: 0.5, fontWeight: 400, marginLeft: 6 }}>
            Casablanca · RH
          </span>
        </div>
      </div>
      <div className="topbar-right">
        <NotifBell />
        <div
          className="user-chip"
          onClick={() => signOut({ callbackUrl: '/login' })}
          title="Se déconnecter"
        >
          <div
            className="avatar"
            style={{ background: `#${color}30`, color: `#${color}` }}
          >
            {initials}
          </div>
          <span className="username">{u.name}</span>
          <span
            className="role-badge"
            style={{
              fontSize: 10,
              padding: '2px 7px',
              borderRadius: 8,
              fontWeight: 600,
              ...(ROLE_STYLES[u.role] ?? {}),
            }}
          >
            {u.role}
          </span>
        </div>
      </div>
    </div>
  )
}
