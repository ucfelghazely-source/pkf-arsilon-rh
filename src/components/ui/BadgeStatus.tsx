interface BadgeStatusProps {
  status: string
}

const STATUS_MAP: Record<string, { cls: string; label: string }> = {
  PENDING_MANAGER: { cls: 'badge-pending', label: 'En attente' },
  PENDING_RH:      { cls: 'badge-pending', label: 'En attente RH' },
  APPROVED:        { cls: 'badge-approved', label: 'Validé' },
  REFUSED:         { cls: 'badge-refused', label: 'Refusé' },
  CANCELLED:       { cls: 'badge-refused', label: 'Annulé' },
  DRAFT:           { cls: '', label: 'Brouillon' },
}

const TYPE_MAP: Record<string, { cls: string; label: string }> = {
  TT:  { cls: 'badge-tt',  label: 'TT' },
  CP:  { cls: 'badge-cp',  label: 'CP' },
  ADM: { cls: 'badge-adm', label: 'ADM' },
  RTT: { cls: 'badge-cp',  label: 'RTT' },
  MALADIE: { cls: 'badge-mal', label: 'MAL' },
  SANS_SOLDE: { cls: 'badge-css', label: 'CSS' },
  RECUPERATION_FERIE: { cls: 'badge-tt', label: 'Récup.' },
}

export function BadgeStatus({ status }: BadgeStatusProps) {
  const { cls, label } = STATUS_MAP[status] ?? { cls: '', label: status }
  return <span className={`badge ${cls}`}>{label}</span>
}

export function BadgeType({ type }: { type: string }) {
  const { cls, label } = TYPE_MAP[type] ?? { cls: '', label: type }
  return <span className={`badge ${cls}`}>{label}</span>
}
