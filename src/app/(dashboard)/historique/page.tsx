import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { fmt, fmtShort } from '@/lib/utils'
import { BadgeStatus, BadgeType } from '@/components/ui/BadgeStatus'

export default async function HistoriquePage() {
  const session = await getServerSession(authOptions)!
  const u = session!.user

  const dbUser = await prisma.user.findUnique({ where: { email: u.email! } })

  const leaveReqs = dbUser
    ? await prisma.leaveRequest.findMany({
        where: { userId: dbUser.id },
        include: { approvals: { include: { approver: true } } },
        orderBy: { createdAt: 'desc' },
      })
    : []

  const ttReqs = dbUser
    ? await prisma.remoteWorkRequest.findMany({
        where: { userId: dbUser.id },
        include: { approvals: { include: { approver: true } } },
        orderBy: { createdAt: 'desc' },
      })
    : []

  const admReqs = dbUser
    ? await prisma.adminRequest.findMany({
        where: { userId: dbUser.id },
        orderBy: { createdAt: 'desc' },
      })
    : []

  return (
    <div className="page">
      <div className="ph">
        <div>
          <div className="ph-title">🕐 Historique</div>
          <div className="ph-sub">Toutes vos demandes</div>
        </div>
        <button className="btn btn-outline btn-sm">📥 Export CSV</button>
      </div>

      <div className="card">
        <div className="tbl-wrap">
          <table>
            <thead>
              <tr>
                <th>Type</th>
                <th>Description</th>
                <th>Date(s)</th>
                <th>Créé le</th>
                <th>Statut</th>
                <th>Valideur</th>
              </tr>
            </thead>
            <tbody>
              {leaveReqs.length === 0 && ttReqs.length === 0 && admReqs.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', color: 'var(--text3)', padding: 20 }}>
                    Aucune demande
                  </td>
                </tr>
              ) : (
                <>
                  {ttReqs.map(r => {
                    const approver = r.approvals[0]?.approver
                    return (
                      <tr key={r.id}>
                        <td><BadgeType type="TT" /></td>
                        <td>Télétravail</td>
                        <td>{fmt(r.date)}</td>
                        <td>{fmt(r.createdAt)}</td>
                        <td><BadgeStatus status={r.status} /></td>
                        <td>{approver ? `${approver.firstName} ${approver.lastName}` : '—'}</td>
                      </tr>
                    )
                  })}
                  {leaveReqs.map(r => {
                    const approver = r.approvals[0]?.approver
                    return (
                      <tr key={r.id}>
                        <td><BadgeType type="CP" /></td>
                        <td>Congés Payés</td>
                        <td>{fmtShort(r.startDate)} → {fmtShort(r.endDate)}</td>
                        <td>{fmt(r.createdAt)}</td>
                        <td><BadgeStatus status={r.status} /></td>
                        <td>{approver ? `${approver.firstName} ${approver.lastName}` : '—'}</td>
                      </tr>
                    )
                  })}
                  {admReqs.map(r => (
                    <tr key={r.id}>
                      <td><BadgeType type="ADM" /></td>
                      <td>Formulaire · {r.type.replace(/_/g, ' ')}</td>
                      <td>—</td>
                      <td>{fmt(r.createdAt)}</td>
                      <td><BadgeStatus status={r.status} /></td>
                      <td>—</td>
                    </tr>
                  ))}
                </>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
