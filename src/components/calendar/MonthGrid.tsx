import type { Task } from '../../types'
import { useApp } from '../../context/AppContext'
import { getMonthMatrix, toIso, todayIso } from '../../utils/dates'

interface Props {
  year: number
  month: number
  tasksByDate: Map<string, Task[]>
  startOfWeek: 'sunday' | 'monday'
}

const WEEKDAY_HEADERS_SUN = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const WEEKDAY_HEADERS_MON = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

const priorityDot: Record<Task['priority'], string> = {
  low: 'bg-priority-low',
  medium: 'bg-priority-medium',
  high: 'bg-priority-high',
  urgent: 'bg-priority-urgent',
}

export default function MonthGrid({ year, month, tasksByDate, startOfWeek }: Props) {
  const { openTask } = useApp()
  const weeks = getMonthMatrix(year, month, startOfWeek)
  const headers = startOfWeek === 'monday' ? WEEKDAY_HEADERS_MON : WEEKDAY_HEADERS_SUN
  const today = todayIso()

  return (
    <div className="overflow-hidden rounded-lg border border-border">
      <div className="grid grid-cols-7 border-b border-border bg-app">
        {headers.map((day) => (
          <div key={day} className="px-2 py-2 text-center text-xs font-medium text-ink-soft">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7">
        {weeks.flat().map((date) => {
          const iso = toIso(date)
          const isCurrentMonth = date.getMonth() === month
          const isToday = iso === today
          const dayTasks = tasksByDate.get(iso) ?? []
          const visible = dayTasks.slice(0, 3)
          const overflow = dayTasks.length - visible.length

          return (
            <div
              key={iso}
              className={`min-h-[92px] border-b border-r border-border-soft p-1.5 last:border-r-0 sm:min-h-[112px] sm:p-2 ${
                isCurrentMonth ? '' : 'bg-app/40'
              }`}
            >
              <span
                className={`inline-flex h-5 w-5 items-center justify-center rounded-full text-xs ${
                  isToday
                    ? 'bg-accent font-semibold text-white'
                    : isCurrentMonth
                      ? 'text-ink-soft'
                      : 'text-ink-faint'
                }`}
              >
                {date.getDate()}
              </span>

              <div className="mt-1 space-y-1">
                {visible.map((task) => (
                  <button
                    key={task.id}
                    type="button"
                    onClick={() => openTask(task.id)}
                    className={`flex w-full items-center gap-1 truncate rounded px-1 py-0.5 text-left text-[0.65rem] leading-tight transition-colors hover:bg-app ${
                      task.status === 'done' ? 'text-ink-faint line-through' : 'text-ink'
                    }`}
                  >
                    <span
                      className={`h-1.5 w-1.5 shrink-0 rounded-full ${priorityDot[task.priority]}`}
                      aria-hidden="true"
                    />
                    <span className="truncate">{task.title}</span>
                  </button>
                ))}
                {overflow > 0 && (
                  <p className="px-1 text-[0.65rem] text-ink-faint">+{overflow} more</p>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
