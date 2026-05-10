import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { ImportClient } from './ImportClient'

export default async function ImportPage() {
  const session = await getServerSession(authOptions)!
  const u = session!.user

  if (u.role !== 'RH' && u.role !== 'ADMIN') redirect('/dashboard')

  return (
    <div className="page">
      <div className="ph">
        <div>
          <div className="ph-title">📥 Import Excel</div>
          <div className="ph-sub">Synchroniser les soldes depuis votre fichier Excel</div>
        </div>
      </div>

      <ImportClient />

      <div className="card">
        <div className="card-hd">
          <div className="card-title">📋 Historique des imports</div>
        </div>
        <div className="req-row">
          <span style={{ fontSize: 18 }}>✅</span>
          <div className="req-info">
            <p>Suivi_CP___Télétravail_Casablanca.xlsx</p>
            <small>Importé le 10/05/2026 · 17 collaborateurs · 24 onglets TT traités</small>
          </div>
          <span className="badge badge-approved">Succès</span>
        </div>
      </div>

      <div className="card">
        <div className="card-hd">
          <div className="card-title">⚙️ Règles métier actives</div>
        </div>
        <table>
          <thead>
            <tr>
              <th>Règle</th>
              <th>Valeur</th>
              <th>Scope</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Quota TT hebdomadaire</td>
              <td><strong>2j / semaine civile</strong></td>
              <td>Standard</td>
            </tr>
            <tr>
              <td>Quota TT mensuel</td>
              <td><strong>12j / mois</strong></td>
              <td>Standard</td>
            </tr>
            <tr>
              <td>Quota TT Ramadan</td>
              <td><strong>3j / semaine</strong></td>
              <td>23 Fév – 22 Mar 2026</td>
            </tr>
            <tr>
              <td>Acquisition CP mensuelle</td>
              <td><strong>2,5j / mois</strong></td>
              <td>Maroc</td>
            </tr>
            <tr>
              <td>Maintien salaire maladie</td>
              <td><strong>3j (ancienneté &gt;1an)</strong></td>
              <td>Tous</td>
            </tr>
            <tr>
              <td>JF Maroc travaillé</td>
              <td><strong>+1j récupération</strong></td>
              <td>Tous</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}
