import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { redirect } from 'next/navigation'
import { cpSolde, soldeColor, fmt, fmtShort } from '@/lib/utils'
import { BadgeType } from '@/components/ui/BadgeStatus'
import { Avatar } from '@/components/ui/Avatar'
import { ValidationActions } from './ValidationActions'

export default async function ValidationsPage() {
  const session = await getServerSession(authOptions)!
  const u = session!.user

  if (u.role !== 'MANAGER' && u.role !== 'RH' && u.role !== 'ADMIN') {
    redirect('/dashboard')
  }

  const pendingLeave = await prisma.leaveRequest.findMany({
    where: { status: 'PENDING_MANAGER' },
    include: {
      user: true,
      approvals: true,
    },
    orderBy: { createdAt: 'asc' },
  })

  const pendingTT = await prisma.remoteWorkRequest.findMany({
    where: { status: 'PENDING_MANAGER' },
    include: {
      user: true,
      approvals: true,
    },
    orderBy: { createdAt: 'asc' },
  })

  const pendingAdm = await prisma.adminRequest.findMany({
    where: { status: 'PENDING_RH' },
    include: { user: true },
    orderBy: { createdAt: 'asc' },
  })

  // Charger les soldes CP pour les demandes de congés
  const userIds = [...new Set(pendingLeave.map(r => r.userId))]
  const balances = await prisma.leaveBalance.findMany({
    where: { userId: { in: userIds }, leaveType: 'CP', fiscalYear: 'FY26' },
  })
  const balMap = Object.fromEntries(balances.map(b => [b.userId, b]))

  const totalPending = pendingLeave.length + pendingTT.length + pendingAdm.length

  return (
    <div className="page">
      <div className="ph">
        <div>
          <div className="ph-title">✅ Validations en attente</div>
          <div className="ph-sub">
            {totalPending} demande{totalPending > 1 ? 's' : ''} à traiter
          </div>
        </div>
      </div>

      {totalPending === 0 && (
        <div className="alert alert-success">
          <span>✅</span>
          Aucune demande en attente. Tout est à jour.
        </div>
      )}

      {/* Demandes TT */}
      {pendingTT.map(r => {
        const c = r.user
        const week20 = 0 // simplification
        return (
          <div key={r.id} className="card">
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
              <Avatar firstName={c.firstName} lastName={c.lastName} color={c.avatarColor} size={40} radius={10} />
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 5 }}>
                  <strong style={{ fontSize: 14 }}>{c.firstName} {c.lastName}</strong>
                  <span className="region-pill">{c.region}</span>
                  <BadgeType type="TT" />
                </div>
                <div style={{ fontSize: 13, color: 'var(--text)' }}>
                  Télétravail · <strong>{fmt(r.date)}</strong> · S{r.weekNumber}
                </div>
                <div style={{ fontSize: 11, color: 'var(--text3)' }}>
                  Soumis le {fmt(r.createdAt)}
                </div>
                <ValidationActions requestId={r.id} requestType="TT" />
              </div>
            </div>
          </div>
        )
      })}

      {/* Demandes CP */}
      {pendingLeave.map(r => {
        const c = r.user
        const bal = balMap[r.userId] ?? null
        const solde = cpSolde(bal)
        const alertMsg =
          solde !== null && r.workingDays > solde
            ? `⚠️ Demande de ${r.workingDays}j mais solde = ${solde}j`
            : ''
        return (
          <div key={r.id} className="card">
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
              <Avatar firstName={c.firstName} lastName={c.lastName} color={c.avatarColor} size={40} radius={10} />
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 5 }}>
                  <strong style={{ fontSize: 14 }}>{c.firstName} {c.lastName}</strong>
                  <span className="region-pill">{c.region}</span>
                  <BadgeType type="CP" />
                </div>
                <div style={{ fontSize: 13, color: 'var(--text)' }}>
                  Congés Payés · <strong>{fmtShort(r.startDate)} → {fmtShort(r.endDate)}</strong> ({r.workingDays}j)
                </div>
                {solde !== null && (
                  <div style={{ fontSize: 11, color: 'var(--text3)', marginTop: 2 }}>
                    Solde CP disponible :{' '}
                    <strong style={{ color: soldeColor(solde) }}>{solde}j</strong>
                  </div>
                )}
                <div style={{ fontSize: 11, color: 'var(--text3)' }}>
                  Soumis le {fmt(r.createdAt)}
                </div>
                {alertMsg && (
                  <div className="alert alert-warn" style={{ marginTop: 8, padding: '6px 10px' }}>
                    <span>⚠️</span>{alertMsg}
                  </div>
                )}
                <ValidationActions requestId={r.id} requestType="CP" />
              </div>
            </div>
          </div>
        )
      })}

      {/* Demandes ADM */}
      {pendingAdm.map(r => {
        const c = r.user
        return (
          <div key={r.id} className="card">
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
              <Avatar firstName={c.firstName} lastName={c.lastName} color={c.avatarColor} size={40} radius={10} />
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 5 }}>
                  <strong style={{ fontSize: 14 }}>{c.firstName} {c.lastName}</strong>
                  <span className="region-pill">{c.region}</span>
                  <BadgeType type="ADM" />
                </div>
                <div style={{ fontSize: 13, color: 'var(--text)' }}>
                  Formulaire · {r.type.replace(/_/g, ' ')}
                </div>
                <div style={{ fontSize: 11, color: 'var(--text3)' }}>
                  Soumis le {fmt(r.createdAt)}
                </div>
                <ValidationActions requestId={r.id} requestType="ADM" />
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
