export type TaskStatus = 'backlog' | 'todo' | 'in-progress' | 'review' | 'done'

export type Priority = 'low' | 'medium' | 'high' | 'urgent'

export type ProjectStatus = 'active' | 'on-hold' | 'completed'

export interface Subtask {
  id: string
  title: string
  completed: boolean
}

export interface Task {
  id: string
  title: string
  description?: string
  status: TaskStatus
  priority: Priority
  projectId: string
  assigneeId?: string
  dueDate?: string // ISO date, yyyy-mm-dd
  tags: string[]
  subtasks: Subtask[]
  createdAt: string
}

export interface Project {
  id: string
  name: string
  description: string
  status: ProjectStatus
  dueDate?: string
  memberIds: string[]
}

export interface User {
  id: string
  name: string
  email: string
  initials: string
  color: string
}

export interface Preferences {
  name: string
  email: string
  theme: 'light' | 'dark'
  dateFormat: 'MDY' | 'DMY'
  startOfWeek: 'sunday' | 'monday'
  emailNotifications: boolean
  taskReminders: boolean
  assignmentNotifications: boolean
}

export type SortOption = 'dueDate' | 'priority' | 'createdAt' | 'alphabetical'

export interface TaskFilters {
  status: TaskStatus | 'all'
  priority: Priority | 'all'
  projectId: string | 'all'
  assigneeId: string | 'all'
}

export interface NewTaskInput {
  title: string
  description?: string
  projectId: string
  priority: Priority
  status: TaskStatus
  dueDate?: string
  assigneeId?: string
}
