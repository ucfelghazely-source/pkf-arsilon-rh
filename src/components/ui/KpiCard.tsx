interface KpiCardProps {
  label: string
  value: string | number
  sub?: string
  color?: string
  barPercent?: number
  barColor?: string
}

export function KpiCard({ label, value, sub, color = 'var(--text)', barPercent, barColor }: KpiCardProps) {
  return (
    <div className="kpi">
      <div className="kpi-lbl">{label}</div>
      <div className="kpi-val" style={{ color }}>{value}</div>
      {sub && <div className="kpi-sub">{sub}</div>}
      {barPercent !== undefined && (
        <div className="kpi-bar">
          <div
            className="kpi-fill"
            style={{ width: `${Math.min(100, Math.max(0, barPercent))}%`, background: barColor ?? color }}
          />
        </div>
      )}
    </div>
  )
}
