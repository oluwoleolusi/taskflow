import { useMemo, useState } from 'react'
import { Plus, Search, Folder } from 'lucide-react'
import { useApp } from '../context/AppContext'
import PageHeader from '../components/ui/PageHeader'
import ProjectRow from '../components/projects/ProjectRow'
import AddProjectModal from '../components/projects/AddProjectModal'
import EmptyState from '../components/ui/EmptyState'
import { parseIso } from '../utils/dates'

type SortOption = 'name' | 'dueDate' | 'status'

export default function Projects() {
  const { projects, tasks } = useApp()
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState<SortOption>('name')
  const [modalOpen, setModalOpen] = useState(false)

  const filtered = useMemo(() => {
    let list = projects
    if (search.trim()) {
      const q = search.trim().toLowerCase()
      list = list.filter(
        (p) => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q),
      )
    }
    const sorted = [...list]
    switch (sort) {
      case 'name':
        sorted.sort((a, b) => a.name.localeCompare(b.name))
        break
      case 'dueDate':
        sorted.sort((a, b) => {
          if (!a.dueDate && !b.dueDate) return 0
          if (!a.dueDate) return 1
          if (!b.dueDate) return -1
          return parseIso(a.dueDate).getTime() - parseIso(b.dueDate).getTime()
        })
        break
      case 'status':
        sorted.sort((a, b) => a.status.localeCompare(b.status))
        break
    }
    return sorted
  }, [projects, search, sort])

  return (
    <div>
      <PageHeader
        title="Projects"
        subtitle={`${projects.length} ${projects.length === 1 ? 'project' : 'projects'}`}
        actions={
          <button type="button" onClick={() => setModalOpen(true)} className="btn-primary">
            <Plus className="h-4 w-4" aria-hidden="true" />
            New project
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
            placeholder="Search projects"
            aria-label="Search projects"
            className="field-input w-48 pl-8 sm:w-64"
          />
        </div>

        <div className="ml-auto flex items-center gap-2">
          <label htmlFor="project-sort" className="text-xs font-medium text-ink-soft">
            Sort
          </label>
          <select
            id="project-sort"
            value={sort}
            onChange={(e) => setSort(e.target.value as SortOption)}
            className="field-input w-auto"
          >
            <option value="name">Name</option>
            <option value="dueDate">Due date</option>
            <option value="status">Status</option>
          </select>
        </div>
      </div>

      <div className="px-4 py-4 sm:px-6">
        {filtered.length === 0 ? (
          <EmptyState
            icon={Folder}
            title="No projects match your search."
            description="Try a different search term, or create a new project."
          />
        ) : (
          <div className="panel overflow-hidden">
            {filtered.map((project) => {
              const projectTasks = tasks.filter((t) => t.projectId === project.id)
              const doneCount = projectTasks.filter((t) => t.status === 'done').length
              return (
                <ProjectRow
                  key={project.id}
                  project={project}
                  taskCount={projectTasks.length}
                  doneCount={doneCount}
                />
              )
            })}
          </div>
        )}
      </div>

      <AddProjectModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  )
}
