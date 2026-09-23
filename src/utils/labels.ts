import type { Priority, ProjectStatus, TaskStatus } from '../types'

export const STATUS_LABELS: Record<TaskStatus, string> = {
  backlog: 'Backlog',
  todo: 'To do',
  'in-progress': 'In progress',
  review: 'Review',
  done: 'Done',
}

export const STATUS_ORDER: TaskStatus[] = ['backlog', 'todo', 'in-progress', 'review', 'done']

export const PRIORITY_LABELS: Record<Priority, string> = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
  urgent: 'Urgent',
}

export const PRIORITY_ORDER: Priority[] = ['urgent', 'high', 'medium', 'low']

export const PROJECT_STATUS_LABELS: Record<ProjectStatus, string> = {
  active: 'Active',
  'on-hold': 'On hold',
  completed: 'Completed',
}
