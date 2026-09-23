import { useMemo, useState } from 'react'
import { Plus, Search, ListChecks } from 'lucide-react'
import { useApp } from '../context/AppContext'
import PageHeader from '../components/ui/PageHeader'
import TaskRow from '../components/tasks/TaskRow'
import EmptyState from '../components/ui/EmptyState'
import { users } from '../data/users'
import { STATUS_LABELS, STATUS_ORDER, PRIORITY_LABELS, PRIORITY_ORDER } from '../utils/labels'
import type { Priority, SortOption, TaskStatus } from '../types'
import { parseIso } from '../utils/dates'

const priorityWeight: Record<Priority, number> = { urgent: 0, high: 1, medium: 2, low: 3 }

export default function MyTasks() {
  const { tasks, projects, currentUserId, openAddTaskModal } = useApp()
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState<TaskStatus | 'all'>('all')
  const [priority, setPriority] = useState<Priority | 'all'>('all')
  const [projectId, setProjectId] = useState<string | 'all'>('all')
  const [assigneeId, setAssigneeId] = useState<string | 'all'>(currentUserId)
  const [sort, setSort] = useState<SortOption>('dueDate')

  const filtered = useMemo(() => {
    let list = tasks

    if (assigneeId !== 'all') list = list.filter((t) => t.assigneeId === assigneeId)
    if (status !== 'all') list = list.filter((t) => t.status === status)
    if (priority !== 'all') list = list.filter((t) => t.priority === priority)
    if (projectId !== 'all') list = list.filter((t) => t.projectId === projectId)
    if (search.trim()) {
      const q = search.trim().toLowerCase()
      list = list.filter((t) => t.title.toLowerCase().includes(q))
    }

    const sorted = [...list]
    switch (sort) {
      case 'dueDate':
        sorted.sort((a, b) => {
          if (!a.dueDate && !b.dueDate) return 0
          if (!a.dueDate) return 1
          if (!b.dueDate) return -1
          return parseIso(a.dueDate).getTime() - parseIso(b.dueDate).getTime()
        })
        break
      case 'priority':
        sorted.sort((a, b) => priorityWeight[a.priority] - priorityWeight[b.priority])
        break
      case 'createdAt':
        sorted.sort(
          (a, b) => parseIso(b.createdAt).getTime() - parseIso(a.createdAt).getTime(),
        )
        break
      case 'alphabetical':
        sorted.sort((a, b) => a.title.localeCompare(b.title))
        break
    }
    return sorted
  }, [tasks, assigneeId, status, priority, projectId, search, sort])

  const grouped = useMemo(() => {
    return STATUS_ORDER.map((s) => ({
      status: s,
      items: filtered.filter((t) => t.status === s),
    })).filter((group) => group.items.length > 0)
  }, [filtered])

  const hasFilters =
    status !== 'all' || priority !== 'all' || projectId !== 'all' || assigneeId !== currentUserId || search.trim() !== ''

  function clearFilters() {
    setSearch('')
    setStatus('all')
    setPriority('all')
    setProjectId('all')
    setAssigneeId(currentUserId)
  }

  return (
    <div>
      <PageHeader
        title="My Tasks"
        subtitle={`${filtered.length} ${filtered.length === 1 ? 'task' : 'tasks'}`}
        actions={
          <button type="button" onClick={() => openAddTaskModal()} className="btn-primary">
            <Plus className="h-4 w-4" aria-hidden="true" />
            Add task
          </button>
        }
      />

      <div className="flex flex-wrap items-center gap-2 border-y border-border-soft px-4 py-3 sm:px-6">
        <div className="relative">
          <Search
            className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-faint"
            aria-hidden="true"
          />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search tasks"
            aria-label="Search tasks"
            className="field-input w-40 pl-8 sm:w-56"
          />
        </div>

        <select
          value={assigneeId}
          onChange={(e) => setAssigneeId(e.target.value)}
          aria-label="Filter by assignee"
          className="field-input w-auto"
        >
          <option value={currentUserId}>Assigned to me</option>
          <option value="all">Everyone</option>
          {users
            .filter((u) => u.id !== currentUserId)
            .map((u) => (
              <option key={u.id} value={u.id}>
                {u.name}
              </option>
            ))}
        </select>

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as TaskStatus | 'all')}
          aria-label="Filter by status"
          className="field-input w-auto"
        >
          <option value="all">All statuses</option>
          {STATUS_ORDER.map((s) => (
            <option key={s} value={s}>
              {STATUS_LABELS[s]}
            </option>
          ))}
        </select>

        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value as Priority | 'all')}
          aria-label="Filter by priority"
          className="field-input w-auto"
        >
          <option value="all">All priorities</option>
          {PRIORITY_ORDER.map((p) => (
            <option key={p} value={p}>
              {PRIORITY_LABELS[p]}
            </option>
          ))}
        </select>

        <select
          value={projectId}
          onChange={(e) => setProjectId(e.target.value)}
          aria-label="Filter by project"
          className="field-input w-auto"
        >
          <option value="all">All projects</option>
          {projects.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>

        {hasFilters && (
          <button type="button" onClick={clearFilters} className="btn-ghost">
            Clear filters
          </button>
        )}

        <div className="ml-auto flex items-center gap-2">
          <label htmlFor="sort-select" className="text-xs font-medium text-ink-soft">
            Sort
          </label>
          <select
            id="sort-select"
            value={sort}
            onChange={(e) => setSort(e.target.value as SortOption)}
            className="field-input w-auto"
          >
            <option value="dueDate">Due date</option>
            <option value="priority">Priority</option>
            <option value="createdAt">Created date</option>
            <option value="alphabetical">Alphabetical</option>
          </select>
        </div>
      </div>

      <div className="px-4 py-2 sm:px-6">
        {grouped.length === 0 ? (
          <div className="py-6">
            <EmptyState
              icon={ListChecks}
              title="No tasks match your search."
              description="Try adjusting filters or search terms."
              action={
                hasFilters ? (
                  <button type="button" onClick={clearFilters} className="btn-secondary mt-1">
                    Clear filters
                  </button>
                ) : undefined
              }
            />
          </div>
        ) : (
          grouped.map((group) => (
            <section key={group.status} className="mb-6">
              <h2 className="px-1 py-2 text-xs font-semibold uppercase tracking-wide text-ink-soft">
                {STATUS_LABELS[group.status]}{' '}
                <span className="text-ink-faint">{group.items.length}</span>
              </h2>
              <div className="panel overflow-hidden">
                {group.items.map((task) => (
                  <TaskRow key={task.id} task={task} />
                ))}
              </div>
            </section>
          ))
        )}
      </div>
    </div>
  )
}
