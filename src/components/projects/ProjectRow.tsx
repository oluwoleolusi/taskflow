import { Link } from 'react-router-dom'
import type { Project } from '../../types'
import { PROJECT_STATUS_LABELS } from '../../utils/labels'
import { formatShortDate } from '../../utils/dates'
import { getUserById } from '../../data/users'
import Avatar from '../ui/Avatar'
import ProgressBar from './ProgressBar'

const statusDot: Record<Project['status'], string> = {
  active: 'bg-status-done',
  'on-hold': 'bg-status-progress',
  completed: 'bg-ink-faint',
}

interface Props {
  project: Project
  taskCount: number
  doneCount: number
}

export default function ProjectRow({ project, taskCount, doneCount }: Props) {
  const progress = taskCount === 0 ? 0 : Math.round((doneCount / taskCount) * 100)
  const members = project.memberIds.map((id) => getUserById(id)).filter(Boolean)

  return (
    <Link
      to={`/projects/${project.id}`}
      className="grid grid-cols-1 gap-3 border-b border-border-soft px-4 py-4 transition-colors hover:bg-app sm:grid-cols-[2fr_1fr_1fr_auto_auto]"
    >
      <div className="min-w-0">
        <p className="truncate text-sm font-medium text-ink">{project.name}</p>
        <p className="mt-0.5 truncate text-xs text-ink-soft">{project.description}</p>
      </div>

      <div className="flex items-center gap-2 text-xs text-ink-soft sm:justify-center">
        <span className={`h-1.5 w-1.5 rounded-full ${statusDot[project.status]}`} aria-hidden="true" />
        {PROJECT_STATUS_LABELS[project.status]}
      </div>

      <div className="flex items-center sm:min-w-[140px]">
        <ProgressBar value={progress} label={`${project.name} progress`} />
      </div>

      <div className="flex items-center gap-1 text-xs text-ink-soft sm:justify-center">
        <span>{taskCount} tasks</span>
        {project.dueDate && <span className="hidden sm:inline">· Due {formatShortDate(project.dueDate)}</span>}
      </div>

      <div className="flex -space-x-2">
        {members.slice(0, 4).map((member) => (
          <span key={member!.id} className="ring-2 ring-surface rounded-full">
            <Avatar user={member} size="sm" />
          </span>
        ))}
      </div>
    </Link>
  )
}
