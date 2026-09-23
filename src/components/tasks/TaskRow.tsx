import type { Task } from '../../types'
import { useApp } from '../../context/AppContext'
import { getProjectById } from '../../data/projects'
import { getUserById } from '../../data/users'
import { isPast, relativeDueLabel } from '../../utils/dates'
import TaskCheckbox from '../ui/TaskCheckbox'
import PriorityBadge from '../ui/PriorityBadge'
import StatusBadge from '../ui/StatusBadge'
import Avatar from '../ui/Avatar'

interface Props {
  task: Task
  showProject?: boolean
  showStatus?: boolean
}

export default function TaskRow({ task, showProject = true, showStatus = false }: Props) {
  const { toggleComplete, openTask } = useApp()
  const project = getProjectById(task.projectId)
  const assignee = getUserById(task.assigneeId)
  const overdue = task.status !== 'done' && task.dueDate ? isPast(task.dueDate) : false
  const doneCount = task.subtasks.filter((s) => s.completed).length

  return (
    <div
      onClick={() => openTask(task.id)}
      className="flex cursor-pointer items-start gap-3 border-b border-border-soft px-3 py-3 transition-colors hover:bg-app sm:items-center sm:px-4"
    >
      <TaskCheckbox
        checked={task.status === 'done'}
        onChange={() => {
          toggleComplete(task.id)
        }}
        label={task.title}
      />

      <div className="min-w-0 flex-1">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            openTask(task.id)
          }}
          className={`block truncate text-left text-sm font-medium ${
            task.status === 'done' ? 'text-ink-faint line-through' : 'text-ink'
          }`}
        >
          {task.title}
        </button>
        <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-ink-soft sm:hidden">
          {showProject && project && <span className="truncate">{project.name}</span>}
          {task.dueDate && (
            <span className={overdue ? 'font-medium text-danger' : ''}>
              {relativeDueLabel(task.dueDate)}
            </span>
          )}
        </div>
      </div>

      {showProject && project && (
        <span className="hidden w-32 shrink-0 truncate text-xs text-ink-soft sm:block">
          {project.name}
        </span>
      )}

      <span className="hidden w-20 shrink-0 sm:block">
        <PriorityBadge priority={task.priority} />
      </span>

      {showStatus && (
        <span className="hidden w-28 shrink-0 sm:block">
          <StatusBadge status={task.status} />
        </span>
      )}

      {task.subtasks.length > 0 && (
        <span className="hidden shrink-0 text-xs text-ink-faint sm:block">
          {doneCount}/{task.subtasks.length}
        </span>
      )}

      {task.dueDate && (
        <span
          className={`hidden w-24 shrink-0 text-right text-xs sm:block ${
            overdue ? 'font-medium text-danger' : 'text-ink-soft'
          }`}
        >
          {relativeDueLabel(task.dueDate)}
        </span>
      )}

      <span className="shrink-0">
        <Avatar user={assignee} size="sm" />
      </span>
    </div>
  )
}
