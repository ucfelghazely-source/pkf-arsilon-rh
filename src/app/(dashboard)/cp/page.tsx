import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { cpSolde, soldeColor, fmt, fmtShort } from '@/lib/utils'
import { BadgeStatus } from '@/components/ui/BadgeStatus'
import { KpiCard } from '@/components/ui/KpiCard'
import { CPActions } from './CPActions'

export default async function CPPage() {
  const session = await getServerSession(authOptions)!
  const u = session!.user

  const dbUser = await prisma.user.findUnique({ where: { email: u.email! } })

  const cpBal = dbUser
    ? await prisma.leaveBalance.findFirst({
        where: { userId: dbUser.id, leaveType: 'CP', fiscalYear: 'FY26' },
      })
    : null

  const solde = cpSolde(cpBal)

  const myCP = dbUser
    ? await prisma.leaveRequest.findMany({
        where: { userId: dbUser.id },
        include: { approvals: { include: { approver: true } } },
        orderBy: { createdAt: 'desc' },
      })
    : []

  return (
    <div className="page">
      <div className="ph">
        <div>
          <div className="ph-title">🏖️ Congés Payés</div>
          <div className="ph-sub">FY26 · Juillet 2025 – Juin 2026</div>
        </div>
        <CPActions userId={dbUser?.id ?? ''} solde={solde} />
      </div>

      {solde !== null && solde < 0 && (
        <div className="alert alert-warn">
          <span className="alert-icon">⚠️</span>
          <strong>Solde débiteur de {Math.abs(solde)}j</strong> — Des jours ont été pris par anticipation.
          Un accord exceptionnel de votre manager est requis.
        </div>
      )}

      {cpBal ? (
        <div className="grid4">
          <KpiCard label="Solde N-1" value={`${cpBal.balanceStart}j`} sub="Reporté FY25" color="var(--blue)" />
          <KpiCard label="CP acquis FY26" value={`${cpBal.acquired}j`} sub="à fin Avr 2026" color="var(--green)" />
          <KpiCard label="CP consommés" value={`${cpBal.consumed}j`} sub="cette année" color="var(--amber)" />
          <KpiCard
            label="Solde actuel"
            value={`${solde}j`}
            sub={solde! < 0 ? '⚠️ Débiteur' : 'disponible'}
            color={soldeColor(solde)}
          />
        </div>
      ) : (
        <div className="card">
          <p style={{ color: 'var(--text3)' }}>Aucun solde CP enregistré pour FY26.</p>
        </div>
      )}

      {cpBal && (
        <div className="card" style={{ borderLeft: '3px solid var(--blue)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontSize: 11, color: 'var(--text3)', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '.5px' }}>
                Solde cumulé à date
              </div>
              <div style={{ fontSize: 32, fontWeight: 700, color: soldeColor(solde), marginTop: 4 }}>
                {solde}j
              </div>
              <div style={{ fontSize: 12, color: 'var(--text2)', marginTop: 2 }}>
                = {cpBal.balanceStart} (N-1) + {cpBal.acquired} (acquis) − {cpBal.consumed} (pris)
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 11, color: 'var(--text3)' }}>Prochaine acquisition</div>
              <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--text)' }}>+1,46j</div>
              <div style={{ fontSize: 11, color: 'var(--text3)' }}>au 1er Juin 2026</div>
            </div>
          </div>
        </div>
      )}

      <div className="card">
        <div className="card-hd">
          <div className="card-title">📋 Mes demandes CP</div>
        </div>
        <div className="tbl-wrap">
          <table>
            <thead>
              <tr>
                <th>Période</th>
                <th>Jours</th>
                <th>Statut</th>
                <th>Validé par</th>
                <th>Note</th>
              </tr>
            </thead>
            <tbody>
              {myCP.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center', color: 'var(--text3)', padding: 20 }}>
                    Aucune demande
                  </td>
                </tr>
              ) : (
                myCP.map(r => {
                  const approver = r.approvals[0]?.approver
                  return (
                    <tr key={r.id}>
                      <td>{fmtShort(r.startDate)} → {fmtShort(r.endDate)}</td>
                      <td>{r.workingDays}j</td>
                      <td><BadgeStatus status={r.status} /></td>
                      <td>{approver ? `${approver.firstName} ${approver.lastName}` : '—'}</td>
                      <td>
                        {r.refusedReason ? (
                          <span style={{ fontSize: 10, color: 'var(--amber)' }}>{r.refusedReason}</span>
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
    </div>
  )
}
