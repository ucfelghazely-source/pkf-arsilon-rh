import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { cpSolde, soldeColor, fmtShort, fmt } from '@/lib/utils'
import Link from 'next/link'
import { BadgeStatus, BadgeType } from '@/components/ui/BadgeStatus'
import { KpiCard } from '@/components/ui/KpiCard'

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)!
  const u = session!.user

  const dbUser = await prisma.user.findUnique({ where: { email: u.email! } })

  const cpBal = dbUser
    ? await prisma.leaveBalance.findFirst({
        where: { userId: dbUser.id, leaveType: 'CP', fiscalYear: 'FY26' },
      })
    : null

  const solde = cpSolde(cpBal)

  const ttThisMonth = dbUser
    ? await prisma.remoteWorkRequest.count({
        where: {
          userId: dbUser.id,
          status: 'APPROVED',
          yearNumber: 2026,
          date: { gte: new Date('2026-05-01'), lte: new Date('2026-05-31') },
        },
      })
    : 0

  const myLeaveRequests = dbUser
    ? await prisma.leaveRequest.findMany({
        where: { userId: dbUser.id },
        orderBy: { createdAt: 'desc' },
        take: 4,
      })
    : []

  const myTTRequests = dbUser
    ? await prisma.remoteWorkRequest.findMany({
        where: { userId: dbUser.id },
        orderBy: { createdAt: 'desc' },
        take: 2,
      })
    : []

  const myPending =
    (dbUser
      ? await prisma.leaveRequest.count({ where: { userId: dbUser.id, status: 'PENDING_MANAGER' } })
      : 0) +
    (dbUser
      ? await prisma.remoteWorkRequest.count({ where: { userId: dbUser.id, status: 'PENDING_MANAGER' } })
      : 0)

  const pendingForManager =
    u.role === 'MANAGER' || u.role === 'RH'
      ? await prisma.leaveRequest.count({ where: { status: 'PENDING_MANAGER' } }) +
        await prisma.remoteWorkRequest.count({ where: { status: 'PENDING_MANAGER' } })
      : 0

  const today = new Date()
  const dayNames = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam']
  const monthNames = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre']

  // Mini calendar Mai 2026
  const holidays = [1, 13]
  const ttDays = [6, 8, 12, 14, 19, 21, 26]
  const startDow = (new Date(2026, 4, 1).getDay() + 6) % 7

  function CalCell({ day }: { day: number }) {
    const dow = (new Date(2026, 4, day).getDay() + 6) % 7
    const isWe = dow >= 5
    const isHoliday = holidays.includes(day)
    const isTT = ttDays.includes(day)
    const isToday = day === 10
    let cls = 'cal-cell'
    if (isToday) cls += ' today'
    else if (isHoliday && !isWe) cls += ' holiday'
    else if (isTT && !isWe) cls += ' tt'
    else if (isWe) cls += ' weekend'
    return <div className={cls}>{day}</div>
  }

  function toReqType(lr: { leaveType: string }) {
    if (['TT', 'CP', 'ADM'].includes(lr.leaveType)) return lr.leaveType
    return 'CP'
  }

  const isManager = u.role === 'MANAGER' || u.role === 'RH'

  return (
    <div className="page">
      {/* Greeting */}
      <div className="greeting">
        <div className="greeting-left">
          <div className="date-box">
            <div className="date-num">10</div>
            <div className="date-lbl">Dim · Mai</div>
          </div>
          <div className="greeting-info">
            <h2>Bonjour, {u.name?.split(' ')[0]} 👋</h2>
            <p>
              {u.role === 'MANAGER'
                ? 'Manager · Bureau de Casablanca'
                : u.role === 'RH'
                ? 'Responsable RH'
                : `${u.region} · Collaborateur`}
            </p>
          </div>
        </div>
        <div className="greeting-right">
          <div className="lbl">Actions en attente</div>
          <div className="big">
            {myPending > 0 ? `${myPending} demande${myPending > 1 ? 's' : ''}` : '✓ Aucune'}
          </div>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid3">
        <KpiCard
          label="Solde Congés Payés"
          value={solde !== null ? `${solde}j` : '—'}
          sub="disponible FY26"
          color={soldeColor(solde)}
          barPercent={solde !== null ? (solde / 25) * 100 : 0}
          barColor={soldeColor(solde)}
        />
        <KpiCard
          label="Télétravail utilisé"
          value={`${ttThisMonth}j`}
          sub="sur 12j max ce mois"
          color="var(--blue)"
          barPercent={(ttThisMonth / 12) * 100}
          barColor="var(--blue)"
        />
        <KpiCard
          label="Demandes en cours"
          value={myPending}
          sub="en attente de validation"
          color="var(--amber)"
        />
      </div>

      {/* Demandes récentes + Calendrier */}
      <div className="grid2">
        <div className="card">
          <div className="card-hd">
            <div className="card-title">📋 Mes demandes récentes</div>
            <Link href="/historique" className="card-action">Tout voir →</Link>
          </div>
          {myLeaveRequests.length === 0 ? (
            <p style={{ color: 'var(--text3)', fontSize: 12 }}>Aucune demande récente</p>
          ) : (
            myLeaveRequests.map(r => (
              <div key={r.id} className="req-row">
                <BadgeType type="CP" />
                <div className="req-info">
                  <p>Congés · {fmtShort(r.startDate)} → {fmtShort(r.endDate)}</p>
                  <small>Créé le {fmt(r.createdAt)}</small>
                </div>
                <BadgeStatus status={r.status} />
              </div>
            ))
          )}
        </div>

        <div className="card">
          <div className="card-hd">
            <div className="card-title">📅 Mai 2026</div>
            <div style={{ display: 'flex', gap: 8, fontSize: 10 }}>
              <span style={{ background: '#DBEAFE', color: '#1E40AF', padding: '2px 6px', borderRadius: 4 }}>■ TT</span>
              <span style={{ background: '#FEF3C7', color: '#92400E', padding: '2px 6px', borderRadius: 4 }}>■ Férié</span>
            </div>
          </div>
          <div className="cal-wrap">
            {['L', 'M', 'M', 'J', 'V', 'S', 'D'].map((d, i) => (
              <div key={i} className="cal-head">{d}</div>
            ))}
            {Array.from({ length: startDow }).map((_, i) => <div key={`e${i}`} />)}
            {Array.from({ length: 31 }, (_, i) => i + 1).map(d => (
              <CalCell key={d} day={d} />
            ))}
          </div>
        </div>
      </div>

      {/* Alertes Manager */}
      {isManager && (
        <div className="card">
          <div className="card-hd">
            <div className="card-title">⚠️ Alertes RH</div>
          </div>
          <div className="alert alert-warn" style={{ marginBottom: 8 }}>
            <span className="alert-icon">⚠️</span>
            <div>
              <strong>Solde CP négatif</strong> — TOUHAMI Youssef : −2,45j. Accord exceptionnel requis.
            </div>
          </div>
          {pendingForManager > 0 && (
            <div className="alert alert-info" style={{ marginBottom: 8 }}>
              <span className="alert-icon">ℹ️</span>
              <div>
                {pendingForManager} demande{pendingForManager > 1 ? 's' : ''} de validation en attente de votre approbation.{' '}
                <Link href="/validations" style={{ color: 'var(--blue)', fontWeight: 600 }}>Voir →</Link>
              </div>
            </div>
          )}
          <div className="alert alert-success">
            <span className="alert-icon">✅</span>
            <div>Règle télétravail respectée cette semaine pour tous les collaborateurs.</div>
          </div>
        </div>
      )}
    </div>
  )
}
