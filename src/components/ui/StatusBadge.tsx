import type { TaskStatus } from '../../types'
import { STATUS_LABELS } from '../../utils/labels'

const dotClass: Record<TaskStatus, string> = {
  backlog: 'bg-status-backlog',
  todo: 'bg-status-todo',
  'in-progress': 'bg-status-progress',
  review: 'bg-status-review',
  done: 'bg-status-done',
}

export default function StatusBadge({ status }: { status: TaskStatus }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-ink-soft">
      <span className={`h-1.5 w-1.5 rounded-full ${dotClass[status]}`} aria-hidden="true" />
      {STATUS_LABELS[status]}
    </span>
  )
}
