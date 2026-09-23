import { useMemo, useState } from 'react'
import { Plus } from 'lucide-react'
import { useApp } from '../context/AppContext'
import PageHeader from '../components/ui/PageHeader'
import BoardColumn from '../components/board/BoardColumn'
import { STATUS_ORDER } from '../utils/labels'

export default function Board() {
  const { tasks, projects, openAddTaskModal } = useApp()
  const [projectId, setProjectId] = useState<string>('all')

  const filtered = useMemo(
    () => (projectId === 'all' ? tasks : tasks.filter((t) => t.projectId === projectId)),
    [tasks, projectId],
  )

  return (
    <div className="flex h-full flex-col">
      <PageHeader
        title="Board"
        subtitle="Drag isn't required — use the arrows on a card to move it between columns."
        actions={
          <button
            type="button"
            onClick={() => openAddTaskModal(projectId !== 'all' ? { projectId } : undefined)}
            className="btn-primary"
          >
            <Plus className="h-4 w-4" aria-hidden="true" />
            Add task
          </button>
        }
      />

      <div className="border-y border-border-soft px-4 py-3 sm:px-6">
        <select
          value={projectId}
          onChange={(e) => setProjectId(e.target.value)}
          aria-label="Filter board by project"
          className="field-input w-auto"
        >
          <option value="all">All projects</option>
          {projects.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
      </div>

      <div className="scrollbar-none flex flex-1 gap-3 overflow-x-auto px-4 py-4 sm:px-6">
        {STATUS_ORDER.map((status) => (
          <BoardColumn
            key={status}
            status={status}
            tasks={filtered.filter((t) => t.status === status)}
            projectId={projectId !== 'all' ? projectId : undefined}
          />
        ))}
      </div>
    </div>
  )
}
