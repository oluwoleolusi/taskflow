import { useMemo, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useApp } from '../context/AppContext'
import PageHeader from '../components/ui/PageHeader'
import MonthGrid from '../components/calendar/MonthGrid'

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

export default function Calendar() {
  const { tasks, preferences } = useApp()
  const now = new Date()
  const [cursor, setCursor] = useState({ year: now.getFullYear(), month: now.getMonth() })

  const tasksByDate = useMemo(() => {
    const map = new Map<string, typeof tasks>()
    for (const task of tasks) {
      if (!task.dueDate) continue
      const existing = map.get(task.dueDate)
      if (existing) existing.push(task)
      else map.set(task.dueDate, [task])
    }
    return map
  }, [tasks])

  function goToPrevMonth() {
    setCursor((c) => (c.month === 0 ? { year: c.year - 1, month: 11 } : { year: c.year, month: c.month - 1 }))
  }

  function goToNextMonth() {
    setCursor((c) => (c.month === 11 ? { year: c.year + 1, month: 0 } : { year: c.year, month: c.month + 1 }))
  }

  function goToToday() {
    setCursor({ year: now.getFullYear(), month: now.getMonth() })
  }

  return (
    <div>
      <PageHeader title="Calendar" subtitle="Tasks by due date" />

      <div className="flex items-center gap-2 border-y border-border-soft px-4 py-3 sm:px-6">
        <button type="button" onClick={goToPrevMonth} aria-label="Previous month" className="icon-btn">
          <ChevronLeft className="h-4 w-4" aria-hidden="true" />
        </button>
        <button type="button" onClick={goToNextMonth} aria-label="Next month" className="icon-btn">
          <ChevronRight className="h-4 w-4" aria-hidden="true" />
        </button>
        <p className="ml-1 text-sm font-semibold text-ink">
          {MONTH_NAMES[cursor.month]} {cursor.year}
        </p>
        <button type="button" onClick={goToToday} className="btn-ghost ml-auto">
          Today
        </button>
      </div>

      <div className="px-4 py-4 sm:px-6">
        <MonthGrid
          year={cursor.year}
          month={cursor.month}
          tasksByDate={tasksByDate}
          startOfWeek={preferences.startOfWeek}
        />
      </div>
    </div>
  )
}
