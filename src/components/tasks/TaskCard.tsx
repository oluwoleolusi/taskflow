import { ChevronLeft, ChevronRight } from 'lucide-react'
import type { Task, TaskStatus } from '../../types'
import { useApp } from '../../context/AppContext'
import { getProjectById } from '../../data/projects'
import { getUserById } from '../../data/users'
import { isPast, relativeDueLabel } from '../../utils/dates'
import { STATUS_ORDER } from '../../utils/labels'
import PriorityBadge from '../ui/PriorityBadge'
import Avatar from '../ui/Avatar'

interface Props {
  task: Task
}

export default function TaskCard({ task }: Props) {
  const { updateTask, openTask } = useApp()
  const project = getProjectById(task.projectId)
  const assignee = getUserById(task.assigneeId)
  const overdue = task.status !== 'done' && task.dueDate ? isPast(task.dueDate) : false

  const currentIndex = STATUS_ORDER.indexOf(task.status)
  const prevStatus: TaskStatus | undefined = STATUS_ORDER[currentIndex - 1]
  const nextStatus: TaskStatus | undefined = STATUS_ORDER[currentIndex + 1]

  return (
    <div
      onClick={() => openTask(task.id)}
      className="cursor-pointer rounded-md border border-border bg-surface p-3 shadow-sm transition-colors hover:border-ink-faint"
    >
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation()
          openTask(task.id)
        }}
        className="block w-full text-left"
      >
        {project && (
          <p className="truncate text-[0.7rem] font-medium text-ink-faint">{project.name}</p>
        )}
        <p className="mt-1 text-sm font-medium leading-snug text-ink">{task.title}</p>
      </button>

      <div className="mt-2.5 flex flex-wrap items-center gap-2">
        <PriorityBadge priority={task.priority} />
        {task.dueDate && (
          <span className={`text-xs ${overdue ? 'font-medium text-danger' : 'text-ink-soft'}`}>
            {relativeDueLabel(task.dueDate)}
          </span>
        )}
      </div>

      {task.tags.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1">
          {task.tags.map((tag) => (
            <span
              key={tag}
              className="rounded border border-border-soft bg-app px-1.5 py-0.5 text-[0.65rem] text-ink-soft"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      <div className="mt-3 flex items-center justify-between border-t border-border-soft pt-2.5">
        <div className="flex items-center gap-1">
          <button
            type="button"
            disabled={!prevStatus}
            onClick={(e) => {
              e.stopPropagation()
              if (prevStatus) updateTask(task.id, { status: prevStatus })
            }}
            aria-label="Move to previous column"
            className="icon-btn h-6 w-6 disabled:cursor-not-allowed disabled:opacity-30"
          >
            <ChevronLeft className="h-3.5 w-3.5" aria-hidden="true" />
          </button>
          <button
            type="button"
            disabled={!nextStatus}
            onClick={(e) => {
              e.stopPropagation()
              if (nextStatus) updateTask(task.id, { status: nextStatus })
            }}
            aria-label="Move to next column"
            className="icon-btn h-6 w-6 disabled:cursor-not-allowed disabled:opacity-30"
          >
            <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
          </button>
        </div>
        <Avatar user={assignee} size="xs" />
      </div>
    </div>
  )
}
