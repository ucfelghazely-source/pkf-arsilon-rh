import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { Avatar } from '@/components/ui/Avatar'

export default async function CalendrierPage() {
  const session = await getServerSession(authOptions)!
  const u = session!.user

  const dbUser = await prisma.user.findUnique({ where: { email: u.email! } })

  const myTT = dbUser
    ? await prisma.remoteWorkRequest.findMany({
        where: { userId: dbUser.id, status: 'APPROVED', yearNumber: 2026 },
      })
    : []

  const myCP = dbUser
    ? await prisma.leaveRequest.findMany({
        where: { userId: dbUser.id, status: 'APPROVED' },
      })
    : []

  const holidays = [1, 13] // Mai 2026
  const ttDays = myTT
    .filter(r => new Date(r.date).getMonth() === 4 && new Date(r.date).getFullYear() === 2026)
    .map(r => new Date(r.date).getDate())

  const startDow = (new Date(2026, 4, 1).getDay() + 6) % 7

  function calCellClass(day: number): string {
    const dow = (new Date(2026, 4, day).getDay() + 6) % 7
    const isWe = dow >= 5
    const isH = holidays.includes(day)
    const isTT = ttDays.includes(day)
    const isToday = day === 10
    let cls = 'cal-cell'
    if (isToday) cls += ' today'
    else if (isH && !isWe) cls += ' holiday'
    else if (isTT && !isWe) cls += ' tt'
    else if (isWe) cls += ' weekend'
    return cls
  }

  return (
    <div className="page">
      <div className="ph">
        <div>
          <div className="ph-title">📅 Mon calendrier</div>
          <div className="ph-sub">Mai 2026 · Absences, TT et jours fériés</div>
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          <button className="btn btn-ghost btn-sm">◀ Avr</button>
          <button className="btn btn-outline btn-sm">Mai 2026</button>
          <button className="btn btn-ghost btn-sm">Jun ▶</button>
        </div>
      </div>

      <div className="card">
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
          {dbUser && (
            <Avatar
              firstName={dbUser.firstName}
              lastName={dbUser.lastName}
              color={dbUser.avatarColor}
              size={38}
              radius={9}
            />
          )}
          <div>
            <div style={{ fontSize: 14, fontWeight: 600 }}>
              {dbUser?.firstName} {dbUser?.lastName}
            </div>
            <div style={{ fontSize: 11, color: 'var(--text3)' }}>
              {u.region} · {u.role}
            </div>
          </div>
          <div style={{ marginLeft: 'auto', display: 'flex', gap: 8, fontSize: 10 }}>
            <span style={{ background: '#DBEAFE', color: '#1E40AF', padding: '3px 8px', borderRadius: 4 }}>■ TT</span>
            <span style={{ background: '#D1FAE5', color: '#065F46', padding: '3px 8px', borderRadius: 4 }}>■ CP</span>
            <span style={{ background: '#FEF3C7', color: '#92400E', padding: '3px 8px', borderRadius: 4 }}>■ Férié</span>
          </div>
        </div>

        <div className="cal-wrap">
          {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map((d, i) => (
            <div key={i} className="cal-head">{d}</div>
          ))}
          {Array.from({ length: startDow }).map((_, i) => <div key={`e${i}`} />)}
          {Array.from({ length: 31 }, (_, i) => i + 1).map(d => (
            <div key={d} className={calCellClass(d)}>{d}</div>
          ))}
        </div>
      </div>

      <div className="card">
        <div className="card-hd">
          <div className="card-title">📋 Événements à venir</div>
        </div>
        {myTT.map(r => (
          <div key={r.id} className="req-row">
            <span style={{ fontSize: 18 }}>💻</span>
            <div className="req-info">
              <p>Télétravail {r.status === 'APPROVED' ? 'validé' : 'en attente'}</p>
              <small>{new Date(r.date).toLocaleDateString('fr-FR', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' })}</small>
            </div>
            <span className={`badge ${r.status === 'APPROVED' ? 'badge-approved' : 'badge-pending'}`}>
              {r.status === 'APPROVED' ? 'Validé' : 'En attente'}
            </span>
          </div>
        ))}
        <div className="req-row">
          <span style={{ fontSize: 18 }}>🎉</span>
          <div className="req-info">
            <p>Ascension</p>
            <small>Jeudi 14 Mai 2026 · Jour férié chômé</small>
          </div>
          <span className="badge" style={{ background: '#FEF3C7', color: '#92400E' }}>Férié</span>
        </div>
        <div className="req-row">
          <span style={{ fontSize: 18 }}>🎉</span>
          <div className="req-info">
            <p>Fête du Travail</p>
            <small>Vendredi 1 Mai 2026 · Jour férié chômé</small>
          </div>
          <span className="badge" style={{ background: '#FEF3C7', color: '#92400E' }}>Férié</span>
        </div>
      </div>
    </div>
  )
}
