interface AvatarProps {
  firstName: string
  lastName: string
  color?: string | null
  size?: number
  radius?: number
}

export function Avatar({ firstName, lastName, color = '2563A8', size = 32, radius = 8 }: AvatarProps) {
  const c = color ?? '2563A8'
  const initials = (firstName[0] + lastName[0]).toUpperCase()
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: radius,
        background: `#${c}20`,
        color: `#${c}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: Math.round(size * 0.38),
        fontWeight: 600,
        flexShrink: 0,
      }}
    >
      {initials}
    </div>
  )
}
