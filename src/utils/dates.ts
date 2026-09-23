const DAY_MS = 24 * 60 * 60 * 1000

function toIso(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

export function todayIso(): string {
  return toIso(new Date())
}

export function offsetIso(days: number): string {
  const d = new Date()
  d.setHours(0, 0, 0, 0)
  d.setDate(d.getDate() + days)
  return toIso(d)
}

export function parseIso(iso: string): Date {
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(y, m - 1, d)
}

export function startOfDay(date: Date): Date {
  const d = new Date(date)
  d.setHours(0, 0, 0, 0)
  return d
}

export function daysBetween(aIso: string, bIso: string): number {
  const a = startOfDay(parseIso(aIso)).getTime()
  const b = startOfDay(parseIso(bIso)).getTime()
  return Math.round((b - a) / DAY_MS)
}

export function isPast(iso: string): boolean {
  return daysBetween(todayIso(), iso) < 0
}

export function isToday(iso: string): boolean {
  return daysBetween(todayIso(), iso) === 0
}

export function isTomorrow(iso: string): boolean {
  return daysBetween(todayIso(), iso) === 1
}

const WEEKDAY_SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const MONTH_SHORT = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
]

export function formatShortDate(iso: string): string {
  const date = parseIso(iso)
  return `${MONTH_SHORT[date.getMonth()]} ${date.getDate()}`
}

export function formatWeekdayDate(iso: string): string {
  const date = parseIso(iso)
  return `${WEEKDAY_SHORT[date.getDay()]}, ${MONTH_SHORT[date.getMonth()]} ${date.getDate()}`
}

export function formatFullDate(iso: string): string {
  const date = parseIso(iso)
  return `${WEEKDAY_SHORT[date.getDay()]}, ${MONTH_SHORT[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`
}

export function formatDateByPreference(iso: string, format: 'MDY' | 'DMY'): string {
  const date = parseIso(iso)
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  const y = date.getFullYear()
  return format === 'MDY' ? `${m}/${d}/${y}` : `${d}/${m}/${y}`
}

export function relativeDueLabel(iso: string): string {
  const diff = daysBetween(todayIso(), iso)
  if (diff === 0) return 'Today'
  if (diff === 1) return 'Tomorrow'
  if (diff === -1) return 'Yesterday'
  if (diff < 0) return `${formatShortDate(iso)} (overdue)`
  if (diff > 0 && diff <= 6) return WEEKDAY_SHORT[parseIso(iso).getDay()]
  return formatShortDate(iso)
}

export function getMonthMatrix(year: number, month: number, startOfWeek: 'sunday' | 'monday') {
  const first = new Date(year, month, 1)
  const firstWeekday = first.getDay()
  const offset = startOfWeek === 'monday' ? (firstWeekday + 6) % 7 : firstWeekday
  const gridStart = new Date(year, month, 1 - offset)

  const weeks: Date[][] = []
  let cursor = new Date(gridStart)
  for (let w = 0; w < 6; w++) {
    const week: Date[] = []
    for (let d = 0; d < 7; d++) {
      week.push(new Date(cursor))
      cursor.setDate(cursor.getDate() + 1)
    }
    weeks.push(week)
  }
  return weeks
}

export { toIso }
