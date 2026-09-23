import type { User } from '../../types'

interface Props {
  user?: User
  size?: 'xs' | 'sm' | 'md'
}

const sizeClasses: Record<NonNullable<Props['size']>, string> = {
  xs: 'h-5 w-5 text-[0.6rem]',
  sm: 'h-6 w-6 text-[0.65rem]',
  md: 'h-8 w-8 text-xs',
}

export default function Avatar({ user, size = 'sm' }: Props) {
  if (!user) {
    return (
      <span
        className={`inline-flex shrink-0 items-center justify-center rounded-full border border-dashed border-border text-ink-faint ${sizeClasses[size]}`}
        title="Unassigned"
        aria-label="Unassigned"
      >
        —
      </span>
    )
  }

  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center rounded-full font-semibold text-white ${sizeClasses[size]}`}
      style={{ backgroundColor: user.color }}
      title={user.name}
      aria-label={user.name}
    >
      {user.initials}
    </span>
  )
}
