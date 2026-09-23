import { useEffect, useMemo, useRef, useState } from 'react'
import { Navigate, useParams } from 'react-router-dom'
import { Plus, ListChecks } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { getUserById } from '../data/users'
import { STATUS_LABELS, STATUS_ORDER, PROJECT_STATUS_LABELS } from '../utils/labels'
import { formatShortDate, parseIso } from '../utils/dates'
import type { ProjectStatus } from '../types'
import Avatar from '../components/ui/Avatar'
import ProgressBar from '../components/projects/ProgressBar'
import TaskRow from '../components/tasks/TaskRow'
import EmptyState from '../components/ui/EmptyState'

export default function ProjectDetail() {
  const { projectId } = useParams<{ projectId: string }>()
  const { projects, tasks, updateProject, openAddTaskModal } = useApp()
  const [statusMenuOpen, setStatusMenuOpen] = useState(false)
  const statusMenuRef = useRef<HTMLDivElement>(null)

  const project = projects.find((p) => p.id === projectId)

  const projectTasks = useMemo(
    () => tasks.filter((t) => t.projectId === projectId),
    [tasks, projectId],
  )

  useEffect(() => {
    if (!statusMenuOpen) return
    function onClick(e: MouseEvent) {
      if (statusMenuRef.current && !statusMenuRef.current.contains(e.target as Node)) {
        setStatusMenuOpen(false)
      }
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setStatusMenuOpen(false)
    }
    window.addEventListener('mousedown', onClick)
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('mousedown', onClick)
      window.removeEventListener('keydown', onKey)
    }
  }, [statusMenuOpen])

  if (!project) {
    return <Navigate to="/projects" replace />
  }

  const doneCount = projectTasks.filter((t) => t.status === 'done').length
  const progress =
    projectTasks.length === 0 ? 0 : Math.round((doneCount / projectTasks.length) * 100)

  const statusCounts = STATUS_ORDER.map((s) => ({
    status: s,
    count: projectTasks.filter((t) => t.status === s).length,
  }))

  const activeTasks = STATUS_ORDER.filter((s) => s !== 'done').flatMap((s) =>
    projectTasks.filter((t) => t.status === s),
  )
  const doneTasks = projectTasks.filter((t) => t.status === 'done')

  const recentlyAdded = [...projectTasks]
    .sort((a, b) => parseIso(b.createdAt).getTime() - parseIso(a.createdAt).getTime())
    .slice(0, 3)

  const members = project.memberIds.map((id) => getUserById(id)).filter(Boolean)

  return (
    <div>
      <div className="border-b border-border-soft px-4 py-5 sm:px-6 sm:py-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0">
            <h1 className="text-xl font-semibold text-ink sm:text-2xl">{project.name}</h1>
            <p className="mt-1.5 max-w-[60ch] text-sm text-ink-soft">{project.description}</p>
          </div>
          <button
            type="button"
            onClick={() => openAddTaskModal({ projectId: project.id })}
            className="btn-primary shrink-0"
          >
            <Plus className="h-4 w-4" aria-hidden="true" />
            Add task
          </button>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-4">
          <div className="relative" ref={statusMenuRef}>
            <button
              type="button"
              onClick={() => setStatusMenuOpen((v) => !v)}
              aria-expanded={statusMenuOpen}
              className="field-input w-auto py-1.5 text-xs font-medium"
            >
              {PROJECT_STATUS_LABELS[project.status]}
            </button>
            {statusMenuOpen && (
              <div className="absolute left-0 top-[calc(100%+4px)] z-20 w-36 rounded-md border border-border bg-surface py-1 shadow-pop">
                {(Object.keys(PROJECT_STATUS_LABELS) as ProjectStatus[]).map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => {
                      updateProject(project.id, { status: s })
                      setStatusMenuOpen(false)
                    }}
                    className="flex w-full items-center px-3 py-1.5 text-left text-sm text-ink hover:bg-app"
                  >
                    {PROJECT_STATUS_LABELS[s]}
                  </button>
                ))}
              </div>
            )}
          </div>

          {project.dueDate && (
            <span className="text-sm text-ink-soft">Due {formatShortDate(project.dueDate)}</span>
          )}

          <div className="flex -space-x-2">
            {members.map((m) => (
              <span key={m!.id} className="rounded-full ring-2 ring-surface">
                <Avatar user={m} size="sm" />
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[1fr_280px]">
        <div>
          {projectTasks.length === 0 ? (
            <EmptyState
              icon={ListChecks}
              title="No tasks in this project yet."
              description="Add the first task to get this project moving."
              action={
                <button
                  type="button"
                  onClick={() => openAddTaskModal({ projectId: project.id })}
                  className="btn-secondary mt-1"
                >
                  Add task
                </button>
              }
            />
          ) : (
            <>
              <h2 className="px-1 py-2 text-xs font-semibold uppercase tracking-wide text-ink-soft">
                Tasks
              </h2>
              <div className="panel overflow-hidden">
                {activeTasks.map((task) => (
                  <TaskRow key={task.id} task={task} showProject={false} showStatus />
                ))}
              </div>

              {doneTasks.length > 0 && (
                <>
                  <h2 className="mt-6 px-1 py-2 text-xs font-semibold uppercase tracking-wide text-ink-soft">
                    Done ({doneTasks.length})
                  </h2>
                  <div className="panel overflow-hidden">
                    {doneTasks.map((task) => (
                      <TaskRow key={task.id} task={task} showProject={false} />
                    ))}
                  </div>
                </>
              )}
            </>
          )}
        </div>

        <aside className="space-y-6">
          <div className="panel p-4">
            <h2 className="text-xs font-semibold uppercase tracking-wide text-ink-soft">
              Progress
            </h2>
            <div className="mt-3">
              <ProgressBar value={progress} label={`${project.name} overall progress`} />
            </div>
            <p className="mt-2 text-xs text-ink-soft">
              {doneCount} of {projectTasks.length} tasks complete
            </p>
            <div className="mt-4 space-y-1.5 border-t border-border-soft pt-3">
              {statusCounts
                .filter((s) => s.count > 0)
                .map((s) => (
                  <div key={s.status} className="flex justify-between text-xs">
                    <span className="text-ink-soft">{STATUS_LABELS[s.status]}</span>
                    <span className="font-medium text-ink">{s.count}</span>
                  </div>
                ))}
            </div>
          </div>

          <div className="panel p-4">
            <h2 className="text-xs font-semibold uppercase tracking-wide text-ink-soft">
              Activity
            </h2>
            {recentlyAdded.length === 0 ? (
              <p className="mt-3 text-xs text-ink-faint">No activity yet.</p>
            ) : (
              <ul className="mt-3 space-y-2.5">
                {recentlyAdded.map((task) => (
                  <li key={task.id} className="text-xs text-ink-soft">
                    <span className="font-medium text-ink">{task.title}</span> was added{' '}
                    {formatShortDate(task.createdAt)}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </aside>
      </div>
    </div>
  )
}
