import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { redirect } from 'next/navigation'
import { cpSolde, soldeColor } from '@/lib/utils'
import { Avatar } from '@/components/ui/Avatar'
import { AdminActions } from './AdminActions'

export default async function AdminPage() {
  const session = await getServerSession(authOptions)!
  const u = session!.user

  if (u.role !== 'RH' && u.role !== 'ADMIN') redirect('/dashboard')

  const collaborateurs = await prisma.user.findMany({
    where: { role: 'COLLABORATEUR', isActive: true },
    orderBy: [{ region: 'asc' }, { lastName: 'asc' }],
  })

  const balances = await prisma.leaveBalance.findMany({
    where: { leaveType: 'CP', fiscalYear: 'FY26' },
  })
  const balMap = Object.fromEntries(balances.map(b => [b.userId, b]))

  const negatives = collaborateurs.filter(c => {
    const b = balMap[c.id]
    const s = cpSolde(b ?? null)
    return s !== null && s < 0
  })

  return (
    <div className="page">
      <div className="ph">
        <div>
          <div className="ph-title">⚙️ Administration des soldes</div>
          <div className="ph-sub">FY26 · Mise à jour manuelle</div>
        </div>
      </div>

      {negatives.map(c => {
        const b = balMap[c.id]
        const s = cpSolde(b ?? null)
        return (
          <div key={c.id} className="alert alert-warn">
            <span>⚠️</span>
            {c.firstName} {c.lastName} : solde CP négatif ({s}j). Vérifier avec le manager.
          </div>
        )
      })}

      <div className="card">
        <div className="tbl-wrap">
          <table>
            <thead>
              <tr>
                <th>Collaborateur</th>
                <th>Matricule</th>
                <th>Région</th>
                <th>Solde N-1</th>
                <th>Acquis</th>
                <th>Pris</th>
                <th>Solde actuel</th>
                <th>JF travaillés</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {collaborateurs.map(c => {
                const b = balMap[c.id]
                const solde = cpSolde(b ?? null)
                if (!b) return null
                return (
                  <tr key={c.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                        <Avatar firstName={c.firstName} lastName={c.lastName} color={c.avatarColor} size={24} radius={6} />
                        <span style={{ fontSize: 12 }}>{c.firstName} {c.lastName}</span>
                      </div>
                    </td>
                    <td style={{ fontSize: 11, color: 'var(--text3)' }}>{c.matricule ?? '—'}</td>
                    <td><span className="region-pill">{c.region}</span></td>
                    <td>{b.balanceStart}j</td>
                    <td>{b.acquired}j</td>
                    <td>{b.consumed}j</td>
                    <td>
                      <strong style={{ color: soldeColor(solde) }}>{solde}j</strong>
                    </td>
                    <td>{b.publicHolidayWorked > 0 ? `+${b.publicHolidayWorked}j` : '—'}</td>
                    <td>
                      <AdminActions
                        userId={c.id}
                        userName={`${c.firstName} ${c.lastName}`}
                        balance={{
                          balanceStart: b.balanceStart,
                          acquired: b.acquired,
                          consumed: b.consumed,
                          publicHolidayWorked: b.publicHolidayWorked,
                        }}
                      />
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
