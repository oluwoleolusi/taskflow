import { Plus, CalendarClock } from 'lucide-react'
import { useApp } from '../context/AppContext'
import PageHeader from '../components/ui/PageHeader'
import TaskRow from '../components/tasks/TaskRow'
import EmptyState from '../components/ui/EmptyState'
import { daysBetween, todayIso } from '../utils/dates'

export default function Upcoming() {
  const { tasks, openAddTaskModal } = useApp()

  const future = tasks.filter((t) => t.status !== 'done' && t.dueDate && daysBetween(todayIso(), t.dueDate) > 0)

  const groups = [
    { label: 'Tomorrow', items: future.filter((t) => daysBetween(todayIso(), t.dueDate!) === 1) },
    {
      label: 'This week',
      items: future.filter((t) => {
        const d = daysBetween(todayIso(), t.dueDate!)
        return d >= 2 && d <= 6
      }),
    },
    {
      label: 'Next week',
      items: future.filter((t) => {
        const d = daysBetween(todayIso(), t.dueDate!)
        return d >= 7 && d <= 13
      }),
    },
    {
      label: 'Later',
      items: future.filter((t) => daysBetween(todayIso(), t.dueDate!) >= 14),
    },
  ].filter((g) => g.items.length > 0)

  return (
    <div>
      <PageHeader
        title="Upcoming"
        subtitle={`${future.length} ${future.length === 1 ? 'task' : 'tasks'} scheduled ahead`}
        actions={
          <button type="button" onClick={() => openAddTaskModal()} className="btn-primary">
            <Plus className="h-4 w-4" aria-hidden="true" />
            Add task
          </button>
        }
      />

      <div className="px-4 py-2 sm:px-6">
        {groups.length === 0 ? (
          <div className="py-6">
            <EmptyState
              icon={CalendarClock}
              title="Nothing scheduled ahead."
              description="Tasks with a future due date will show up here."
            />
          </div>
        ) : (
          groups.map((group) => (
            <section key={group.label} className="mb-6">
              <h2 className="px-1 py-2 text-xs font-semibold uppercase tracking-wide text-ink-soft">
                {group.label} <span className="text-ink-faint">{group.items.length}</span>
              </h2>
              <div className="panel overflow-hidden">
                {group.items.map((task) => (
                  <TaskRow key={task.id} task={task} showStatus />
                ))}
              </div>
            </section>
          ))
        )}
      </div>
    </div>
  )
}
