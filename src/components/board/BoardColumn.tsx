import { Plus } from 'lucide-react'
import type { Task, TaskStatus } from '../../types'
import { useApp } from '../../context/AppContext'
import { STATUS_LABELS } from '../../utils/labels'
import TaskCard from '../tasks/TaskCard'

interface Props {
  status: TaskStatus
  tasks: Task[]
  projectId?: string
}

export default function BoardColumn({ status, tasks, projectId }: Props) {
  const { openAddTaskModal } = useApp()

  return (
    <div className="flex w-72 shrink-0 flex-col rounded-lg bg-app/60 p-2.5 sm:w-80">
      <div className="flex items-center justify-between px-1.5 py-1.5">
        <p className="text-sm font-semibold text-ink">
          {STATUS_LABELS[status]} <span className="ml-1 text-ink-faint">{tasks.length}</span>
        </p>
        <button
          type="button"
          onClick={() => openAddTaskModal({ status, projectId })}
          aria-label={`Add task to ${STATUS_LABELS[status]}`}
          className="icon-btn h-7 w-7"
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>

      <div className="mt-1 flex-1 space-y-2.5 overflow-y-auto px-0.5 pb-2">
        {tasks.length === 0 ? (
          <p className="px-2 py-4 text-center text-xs text-ink-faint">No tasks</p>
        ) : (
          tasks.map((task) => <TaskCard key={task.id} task={task} />)
        )}
      </div>
    </div>
  )
}
