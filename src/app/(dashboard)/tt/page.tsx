import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { fmt } from '@/lib/utils'
import { BadgeStatus } from '@/components/ui/BadgeStatus'
import { Avatar } from '@/components/ui/Avatar'
import { KpiCard } from '@/components/ui/KpiCard'
import { TTActions } from './TTActions'

export default async function TTPage() {
  const session = await getServerSession(authOptions)!
  const u = session!.user

  const dbUser = await prisma.user.findUnique({ where: { email: u.email! } })

  const myTT = dbUser
    ? await prisma.remoteWorkRequest.findMany({
        where: { userId: dbUser.id },
        include: { approvals: { include: { approver: true } } },
        orderBy: { date: 'desc' },
      })
    : []

  const ttThisMonth = myTT.filter(
    r => ['APPROVED', 'PENDING_MANAGER'].includes(r.status) &&
      r.yearNumber === 2026 &&
      new Date(r.date).getMonth() === 4, // Mai = 4
  ).length

  const week20Used = myTT.filter(
    r => r.weekNumber === 20 && r.yearNumber === 2026 && ['APPROVED', 'PENDING_MANAGER'].includes(r.status),
  ).length

  // Quota équipe S20
  const allCollabs = await prisma.user.findMany({
    where: { role: 'COLLABORATEUR', isActive: true },
    orderBy: { lastName: 'asc' },
  })

  const teamWeek20 = await prisma.remoteWorkRequest.findMany({
    where: {
      weekNumber: 20,
      yearNumber: 2026,
      status: { in: ['APPROVED', 'PENDING_MANAGER'] },
    },
  })

  return (
    <div className="page">
      <div className="ph">
        <div>
          <div className="ph-title">💻 Télétravail</div>
          <div className="ph-sub">Maximum 2 jours par semaine civile · Quota mensuel : 12 jours</div>
        </div>
        <TTActions userId={dbUser?.id ?? ''} week20Used={week20Used} />
      </div>

      {week20Used >= 2 && (
        <div className="alert alert-warn">
          <span className="alert-icon">⚠️</span>
          Semaine S20 : quota 2j/semaine atteint. Impossible d'ajouter une nouvelle demande cette semaine.
        </div>
      )}

      <div className="grid3">
        <KpiCard
          label="TT ce mois"
          value={`${ttThisMonth}j`}
          sub="sur 12 autorisés"
          color="var(--blue)"
          barPercent={(ttThisMonth / 12) * 100}
          barColor="var(--blue)"
        />
        <KpiCard
          label="Cette semaine (S20)"
          value={`${week20Used}/2j`}
          sub={week20Used >= 2 ? 'Quota hebdo atteint' : 'Quota disponible'}
          color={week20Used >= 2 ? 'var(--red)' : 'var(--green)'}
        />
        <KpiCard
          label="Restant ce mois"
          value={`${12 - ttThisMonth}j`}
          sub="disponibles"
          color="var(--amber)"
        />
      </div>

      <div className="card">
        <div className="card-hd">
          <div className="card-title">📋 Mes demandes TT</div>
        </div>
        <div className="tbl-wrap">
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Semaine</th>
                <th>Statut</th>
                <th>Validé par</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {myTT.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center', color: 'var(--text3)', padding: 20 }}>
                    Aucune demande
                  </td>
                </tr>
              ) : (
                myTT.map(r => {
                  const approver = r.approvals[0]?.approver
                  return (
                    <tr key={r.id}>
                      <td>{fmt(r.date)}</td>
                      <td>S{r.weekNumber}</td>
                      <td><BadgeStatus status={r.status} /></td>
                      <td>{approver ? `${approver.firstName} ${approver.lastName}` : '—'}</td>
                      <td>
                        {r.status === 'PENDING_MANAGER' ? (
                          <TTActions userId={dbUser?.id ?? ''} week20Used={week20Used} cancelId={r.id} />
                        ) : '—'}
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="card">
        <div className="card-hd">
          <div className="card-title">👥 Quota équipe — Semaine S20</div>
        </div>
        {allCollabs.slice(0, 10).map(c => {
          const used = teamWeek20.filter(r => r.userId === c.id).length
          return (
            <div key={c.id} className="qbar">
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 160 }}>
                <Avatar firstName={c.firstName} lastName={c.lastName} color={c.avatarColor} size={22} radius={5} />
                <span style={{ fontSize: 12, color: 'var(--text2)' }}>
                  {c.firstName} {c.lastName.split(' ')[0]}
                </span>
              </div>
              <div className="qbar-track">
                <div
                  className="qbar-fill"
                  style={{
                    width: `${(used / 2) * 100}%`,
                    background: used >= 2 ? 'var(--red)' : used === 1 ? 'var(--amber)' : 'var(--green)',
                  }}
                />
              </div>
              <div
                className="qbar-count"
                style={{ color: used >= 2 ? 'var(--red)' : 'var(--text2)' }}
              >
                {used}/2
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
