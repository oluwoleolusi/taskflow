import { Flag } from 'lucide-react'
import type { Priority } from '../../types'
import { PRIORITY_LABELS } from '../../utils/labels'

const colorClass: Record<Priority, string> = {
  low: 'text-priority-low',
  medium: 'text-priority-medium',
  high: 'text-priority-high',
  urgent: 'text-priority-urgent',
}

export default function PriorityBadge({ priority }: { priority: Priority }) {
  return (
    <span className={`inline-flex items-center gap-1 text-xs font-medium ${colorClass[priority]}`}>
      <Flag className="h-3.5 w-3.5" aria-hidden="true" strokeWidth={2.25} />
      {PRIORITY_LABELS[priority]}
    </span>
  )
}
