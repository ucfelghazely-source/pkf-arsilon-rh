// ── Formatage dates ─────────────────────────────────────────
export function fmt(d: string | Date | null | undefined): string {
  if (!d) return '—'
  return new Date(d).toLocaleDateString('fr-FR', {
    day: '2-digit', month: 'short', year: 'numeric',
  })
}

export function fmtShort(d: string | Date | null | undefined): string {
  if (!d) return '—'
  return new Date(d).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' })
}

// ── Initiales ───────────────────────────────────────────────
export function initials(firstName: string, lastName: string): string {
  return (firstName[0] + lastName[0]).toUpperCase()
}

export function fullName(firstName: string, lastName: string): string {
  return `${firstName} ${lastName}`
}

// ── Calcul solde CP ─────────────────────────────────────────
export function cpSolde(balance: { balanceStart: number; acquired: number; consumed: number } | null): number | null {
  if (!balance) return null
  return +((balance.balanceStart + balance.acquired - balance.consumed).toFixed(2))
}

// ── Couleur solde ───────────────────────────────────────────
export function soldeColor(s: number | null): string {
  if (s === null) return 'var(--text2)'
  if (s < 0) return 'var(--red)'
  if (s < 3) return 'var(--amber)'
  return 'var(--green)'
}

// ── Numéro de semaine ISO ───────────────────────────────────
export function getISOWeek(date: Date): number {
  const d = new Date(date)
  d.setHours(0, 0, 0, 0)
  d.setDate(d.getDate() + 3 - ((d.getDay() + 6) % 7))
  const week1 = new Date(d.getFullYear(), 0, 4)
  return 1 + Math.round(((d.getTime() - week1.getTime()) / 86400000 - 3 + ((week1.getDay() + 6) % 7)) / 7)
}

// ── Jours ouvrés entre deux dates ──────────────────────────
export function workingDaysBetween(start: Date, end: Date): number {
  let count = 0
  const cur = new Date(start)
  while (cur <= end) {
    const dow = cur.getDay()
    if (dow !== 0 && dow !== 6) count++
    cur.setDate(cur.getDate() + 1)
  }
  return count
}

// ── Labels ─────────────────────────────────────────────────
export const LEAVE_TYPE_LABELS: Record<string, string> = {
  CP: 'Congé Payé',
  RTT: 'RTT',
  SANS_SOLDE: 'Sans Solde',
  MALADIE: 'Maladie',
  MATERNITE: 'Maternité',
  PATERNITE: 'Paternité',
  EVENEMENT_FAMILIAL: 'Événement familial',
  RECUPERATION_FERIE: 'Récupération férié',
}

export const STATUS_LABELS: Record<string, string> = {
  PENDING_MANAGER: 'En attente',
  PENDING_RH: 'En attente RH',
  APPROVED: 'Validé',
  REFUSED: 'Refusé',
  CANCELLED: 'Annulé',
  DRAFT: 'Brouillon',
}

export const REGION_LABELS: Record<string, string> = {
  IDF: 'Île-de-France',
  SO: 'Sud-Ouest',
  SUD: 'Sud',
  RABE: 'Rabé',
  NORD: 'Nord',
  GO: 'Grand Ouest',
  CDG: 'CDG',
  IT: 'IT',
  ITRA: 'ITRA',
  ALL: 'Toutes régions',
  RH: 'RH',
  Management: 'Management',
}
