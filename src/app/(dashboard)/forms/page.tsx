import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { fmt } from '@/lib/utils'
import { BadgeStatus } from '@/components/ui/BadgeStatus'
import { FormsClient } from './FormsClient'

const FORMS = [
  { id: 'ATTESTATION_TRAVAIL',     icon: '📄', title: "Attestation de travail",    sub: 'Génération PDF automatique', color: 'var(--purple)' },
  { id: 'CHANGEMENT_ADRESSE',      icon: '🏠', title: "Changement d'adresse",      sub: 'Mettre à jour',             color: 'var(--blue)' },
  { id: 'CHANGEMENT_EMAIL',        icon: '✉️', title: 'Changement email',           sub: 'Personnel',                color: 'var(--blue)' },
  { id: 'CHANGEMENT_RIB',          icon: '💳', title: 'Changement RIB',             sub: 'Coordonnées bancaires',    color: 'var(--green)' },
  { id: 'REMBOURSEMENT_TRANSPORT', icon: '🚌', title: 'Remboursement transport',   sub: 'Frais de trajet',          color: 'var(--amber)' },
  { id: 'COMPOSITION_FAMILIALE',   icon: '👨‍👩‍👧', title: 'Composition familiale',    sub: 'Naissance, enfant à charge', color: 'var(--green)' },
  { id: 'TITRE_SEJOUR',            icon: '🪪', title: 'Titre de séjour',           sub: 'Autorisation de travail',  color: 'var(--red)' },
  { id: 'TICKETS_RESTAURANT',      icon: '🍽️', title: 'Tickets restaurant',        sub: 'Activation / Suspension', color: 'var(--amber)' },
]

export default async function FormsPage() {
  const session = await getServerSession(authOptions)!
  const u = session!.user

  const dbUser = await prisma.user.findUnique({ where: { email: u.email! } })

  const myAdm = dbUser
    ? await prisma.adminRequest.findMany({
        where: { userId: dbUser.id },
        orderBy: { createdAt: 'desc' },
      })
    : []

  return (
    <div className="page">
      <div className="ph">
        <div>
          <div className="ph-title">📋 Formulaires RH</div>
          <div className="ph-sub">Demandes administratives</div>
        </div>
      </div>

      <FormsClient forms={FORMS} />

      <div className="card">
        <div className="card-hd">
          <div className="card-title">📋 Mes demandes administratives</div>
        </div>
        {myAdm.length === 0 ? (
          <p style={{ color: 'var(--text3)', fontSize: 12 }}>Aucune demande</p>
        ) : (
          <div className="tbl-wrap">
            <table>
              <thead>
                <tr>
                  <th>Type</th>
                  <th>Date</th>
                  <th>Statut</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {myAdm.map(r => (
                  <tr key={r.id}>
                    <td>{r.type.replace(/_/g, ' ')}</td>
                    <td>{fmt(r.createdAt)}</td>
                    <td><BadgeStatus status={r.status} /></td>
                    <td>
                      {r.status === 'APPROVED' && r.type === 'ATTESTATION_TRAVAIL' ? (
                        <button
                          className="btn btn-green btn-sm"
                          onClick={() => alert('Attestation téléchargée')}
                        >
                          📥 Télécharger
                        </button>
                      ) : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
