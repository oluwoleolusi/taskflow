import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'

interface Props {
  icon: LucideIcon
  title: string
  description?: string
  action?: ReactNode
}

export default function EmptyState({ icon: Icon, title, description, action }: Props) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-border px-6 py-16 text-center">
      <Icon className="h-8 w-8 text-ink-faint" strokeWidth={1.5} aria-hidden="true" />
      <p className="text-sm font-medium text-ink">{title}</p>
      {description && <p className="max-w-[36ch] text-sm text-ink-soft">{description}</p>}
      {action}
    </div>
  )
}
