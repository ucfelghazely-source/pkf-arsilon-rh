'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface SidebarProps {
  role: string
  pendingCount: number
}

export function Sidebar({ role, pendingCount }: SidebarProps) {
  const pathname = usePathname()

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + '/')

  function NavItem({
    href,
    icon,
    label,
    badge,
  }: {
    href: string
    icon: string
    label: string
    badge?: number
  }) {
    return (
      <Link href={href} className={`nav-item${isActive(href) ? ' active' : ''}`}>
        <span className="nav-icon">{icon}</span>
        {label}
        {badge !== undefined && badge > 0 && (
          <span className="nav-badge">{badge}</span>
        )}
      </Link>
    )
  }

  const isManager = role === 'MANAGER' || role === 'RH' || role === 'ADMIN'
  const isRH = role === 'RH' || role === 'ADMIN'

  return (
    <nav className="sidebar">
      <div className="sid-section">
        <div className="sid-lbl">Principal</div>
        <NavItem href="/dashboard" icon="🏠" label="Tableau de bord" />
        <NavItem href="/tt" icon="💻" label="Télétravail" />
        <NavItem href="/cp" icon="🏖️" label="Congés Payés" />
        <NavItem href="/forms" icon="📋" label="Formulaires" />
      </div>

      <div className="sid-section">
        <div className="sid-lbl">Mon espace</div>
        <NavItem href="/calendrier" icon="📅" label="Mon calendrier" />
        <NavItem href="/historique" icon="🕐" label="Historique" />
      </div>

      {isManager && (
        <div className="sid-section">
          <div className="sid-lbl">Management</div>
          <NavItem href="/validations" icon="✅" label="Validations" badge={pendingCount} />
          <NavItem href="/equipe" icon="👥" label="Mon équipe" />
        </div>
      )}

      {isRH && (
        <div className="sid-section">
          <div className="sid-lbl">Administration RH</div>
          <NavItem href="/admin" icon="⚙️" label="Admin soldes" />
          <NavItem href="/import" icon="📥" label="Import Excel" />
        </div>
      )}
    </nav>
  )
}
