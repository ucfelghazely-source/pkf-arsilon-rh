import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { redirect } from 'next/navigation'
import { cpSolde, soldeColor, fmt } from '@/lib/utils'
import { Avatar } from '@/components/ui/Avatar'

export default async function EquipePage() {
  const session = await getServerSession(authOptions)!
  const u = session!.user

  if (u.role !== 'MANAGER' && u.role !== 'RH' && u.role !== 'ADMIN') {
    redirect('/dashboard')
  }

  const collaborateurs = await prisma.user.findMany({
    where: { role: 'COLLABORATEUR', isActive: true },
    orderBy: [{ region: 'asc' }, { lastName: 'asc' }],
  })

  const balances = await prisma.leaveBalance.findMany({
    where: { leaveType: 'CP', fiscalYear: 'FY26' },
  })
  const balMap = Object.fromEntries(balances.map(b => [b.userId, b]))

  const ttThisMonth = await prisma.remoteWorkRequest.findMany({
    where: {
      status: 'APPROVED',
      yearNumber: 2026,
      date: { gte: new Date('2026-05-01'), lte: new Date('2026-05-31') },
    },
  })
  const ttMap: Record<string, number> = {}
  ttThisMonth.forEach(r => { ttMap[r.userId] = (ttMap[r.userId] ?? 0) + 1 })

  return (
    <div className="page">
      <div className="ph">
        <div>
          <div className="ph-title">👥 Mon équipe</div>
          <div className="ph-sub">Bureau de Casablanca · {collaborateurs.length} collaborateurs</div>
        </div>
        <button className="btn btn-outline btn-sm">📥 Export</button>
      </div>

      <div className="card">
        <div className="tbl-wrap">
          <table>
            <thead>
              <tr>
                <th>Collaborateur</th>
                <th>Région</th>
                <th>Entrée</th>
                <th>Solde CP</th>
                <th>TT ce mois</th>
                <th>Statut</th>
              </tr>
            </thead>
            <tbody>
              {collaborateurs.map(c => {
                const bal = balMap[c.id] ?? null
                const solde = cpSolde(bal)
                const tt = ttMap[c.id] ?? 0
                return (
                  <tr key={c.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <Avatar firstName={c.firstName} lastName={c.lastName} color={c.avatarColor} size={28} radius={7} />
                        <span>{c.firstName} {c.lastName}</span>
                      </div>
                    </td>
                    <td><span className="region-pill">{c.region}</span></td>
                    <td style={{ fontSize: 11, color: 'var(--text3)' }}>
                      {fmt(c.entryDate)}
                    </td>
                    <td>
                      <strong style={{ color: soldeColor(solde) }}>
                        {solde !== null ? `${solde}j` : '—'}
                      </strong>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span>{tt}j</span>
                        <div style={{ width: 50, height: 5, borderRadius: 2, background: 'var(--border)', overflow: 'hidden' }}>
                          <div
                            style={{
                              width: `${(tt / 12) * 100}%`,
                              height: '100%',
                              background: tt >= 12 ? 'var(--red)' : tt >= 9 ? 'var(--amber)' : 'var(--blue)',
                              borderRadius: 2,
                            }}
                          />
                        </div>
                      </div>
                    </td>
                    <td><span className="badge badge-approved">Actif</span></td>
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
