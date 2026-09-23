import { Plus, CheckCircle2 } from 'lucide-react'
import { useApp } from '../context/AppContext'
import PageHeader from '../components/ui/PageHeader'
import TaskRow from '../components/tasks/TaskRow'
import EmptyState from '../components/ui/EmptyState'
import { formatFullDate, isPast, isToday, todayIso } from '../utils/dates'

export default function Today() {
  const { tasks, openAddTaskModal } = useApp()

  const overdue = tasks.filter(
    (t) => t.status !== 'done' && t.dueDate && isPast(t.dueDate),
  )
  const dueToday = tasks.filter(
    (t) => t.status !== 'done' && t.dueDate && isToday(t.dueDate),
  )
  const completed = tasks.filter(
    (t) => t.status === 'done' && t.dueDate && (isPast(t.dueDate) || isToday(t.dueDate)),
  )
  const totalDueToday = tasks.filter((t) => t.dueDate && isToday(t.dueDate)).length

  const isEmpty = overdue.length === 0 && dueToday.length === 0 && completed.length === 0

  return (
    <div>
      <PageHeader
        title="Today"
        subtitle={formatFullDate(todayIso())}
        actions={
          <button
            type="button"
            onClick={() => openAddTaskModal({ dueDate: todayIso() })}
            className="btn-primary"
          >
            <Plus className="h-4 w-4" aria-hidden="true" />
            Add task
          </button>
        }
      />

      <div className="flex flex-wrap gap-x-6 gap-y-2 border-y border-border-soft px-4 py-3 text-sm text-ink-soft sm:px-6">
        <span>
          <span className="font-semibold text-ink">{totalDueToday}</span> due today
        </span>
        <span>
          <span className="font-semibold text-ink">{completed.length}</span> completed
        </span>
        <span>
          <span className={`font-semibold ${overdue.length > 0 ? 'text-danger' : 'text-ink'}`}>
            {overdue.length}
          </span>{' '}
          overdue
        </span>
      </div>

      <div className="px-4 py-2 sm:px-6">
        {isEmpty && (
          <div className="py-6">
            <EmptyState
              icon={CheckCircle2}
              title="You're all caught up."
              description="Nothing overdue or due today. Enjoy the clear runway."
            />
          </div>
        )}

        {overdue.length > 0 && (
          <section className="mb-6">
            <h2 className="px-1 py-2 text-xs font-semibold uppercase tracking-wide text-danger">
              Overdue
            </h2>
            <div className="panel overflow-hidden">
              {overdue.map((task) => (
                <TaskRow key={task.id} task={task} />
              ))}
            </div>
          </section>
        )}

        {dueToday.length > 0 && (
          <section className="mb-6">
            <h2 className="px-1 py-2 text-xs font-semibold uppercase tracking-wide text-ink-soft">
              Due today
            </h2>
            <div className="panel overflow-hidden">
              {dueToday.map((task) => (
                <TaskRow key={task.id} task={task} />
              ))}
            </div>
          </section>
        )}

        {completed.length > 0 && (
          <section className="mb-6">
            <h2 className="px-1 py-2 text-xs font-semibold uppercase tracking-wide text-ink-soft">
              Completed
            </h2>
            <div className="panel overflow-hidden">
              {completed.map((task) => (
                <TaskRow key={task.id} task={task} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
