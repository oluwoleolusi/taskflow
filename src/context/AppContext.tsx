import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import type { ReactNode } from 'react'
import type {
  NewTaskInput,
  Preferences,
  Project,
  Task,
} from '../types'
import { seedTasks } from '../data/tasks'
import { projects as seedProjects } from '../data/projects'
import { currentUserId } from '../data/users'
import { todayIso } from '../utils/dates'

const TASKS_KEY = 'taskflow.tasks.v1'
const PROJECTS_KEY = 'taskflow.projects.v1'
const PREFS_KEY = 'taskflow.preferences.v1'

const defaultPreferences: Preferences = {
  name: 'You',
  email: 'you@taskflow.app',
  theme: 'light',
  dateFormat: 'MDY',
  startOfWeek: 'sunday',
  emailNotifications: true,
  taskReminders: true,
  assignmentNotifications: true,
}

function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const raw = window.localStorage.getItem(key)
    if (!raw) return fallback
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

let idCounter = 1000
function generateId(prefix: string): string {
  idCounter += 1
  return `${prefix}${idCounter}`
}

interface Toast {
  id: string
  message: string
}

interface AddTaskModalState {
  open: boolean
  defaults?: Partial<NewTaskInput>
}

interface AppContextValue {
  tasks: Task[]
  projects: Project[]
  preferences: Preferences
  currentUserId: string

  addTask: (input: NewTaskInput) => string
  updateTask: (id: string, patch: Partial<Task>) => void
  deleteTask: (id: string) => void
  toggleComplete: (id: string) => void

  addProject: (input: Omit<Project, 'id'>) => string
  updateProject: (id: string, patch: Partial<Project>) => void

  updatePreferences: (patch: Partial<Preferences>) => void

  toasts: Toast[]
  showToast: (message: string) => void
  dismissToast: (id: string) => void

  openTaskId: string | null
  openTask: (id: string) => void
  closeTask: () => void

  addTaskModal: AddTaskModalState
  openAddTaskModal: (defaults?: Partial<NewTaskInput>) => void
  closeAddTaskModal: () => void
}

const AppContext = createContext<AppContextValue | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>(() => loadFromStorage(TASKS_KEY, seedTasks))
  const [projects, setProjects] = useState<Project[]>(() =>
    loadFromStorage(PROJECTS_KEY, seedProjects),
  )
  const [preferences, setPreferences] = useState<Preferences>(() =>
    loadFromStorage(PREFS_KEY, defaultPreferences),
  )
  const [toasts, setToasts] = useState<Toast[]>([])
  const [openTaskId, setOpenTaskId] = useState<string | null>(null)
  const [addTaskModal, setAddTaskModal] = useState<AddTaskModalState>({ open: false })
  const hydrated = useRef(false)

  useEffect(() => {
    hydrated.current = true
  }, [])

  useEffect(() => {
    if (!hydrated.current) return
    window.localStorage.setItem(TASKS_KEY, JSON.stringify(tasks))
  }, [tasks])

  useEffect(() => {
    if (!hydrated.current) return
    window.localStorage.setItem(PROJECTS_KEY, JSON.stringify(projects))
  }, [projects])

  useEffect(() => {
    if (!hydrated.current) return
    window.localStorage.setItem(PREFS_KEY, JSON.stringify(preferences))
  }, [preferences])

  useEffect(() => {
    document.documentElement.classList.toggle('dark', preferences.theme === 'dark')
  }, [preferences.theme])

  const showToast = useCallback((message: string) => {
    const toastId = generateId('toast')
    setToasts((prev) => [...prev, { id: toastId, message }])
    window.setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== toastId))
    }, 3200)
  }, [])

  const dismissToast = useCallback((toastId: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== toastId))
  }, [])

  const addTask = useCallback(
    (input: NewTaskInput) => {
      const newId = generateId('t')
      const task: Task = {
        id: newId,
        title: input.title,
        description: input.description,
        status: input.status,
        priority: input.priority,
        projectId: input.projectId,
        assigneeId: input.assigneeId,
        dueDate: input.dueDate,
        tags: [],
        subtasks: [],
        createdAt: todayIso(),
      }
      setTasks((prev) => [task, ...prev])
      return newId
    },
    [],
  )

  const updateTask = useCallback((taskId: string, patch: Partial<Task>) => {
    setTasks((prev) => prev.map((t) => (t.id === taskId ? { ...t, ...patch } : t)))
  }, [])

  const deleteTask = useCallback((taskId: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== taskId))
  }, [])

  const toggleComplete = useCallback((taskId: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id !== taskId) return t
        return { ...t, status: t.status === 'done' ? 'todo' : 'done' }
      }),
    )
  }, [])

  const addProject = useCallback((input: Omit<Project, 'id'>) => {
    const newId = generateId('p')
    setProjects((prev) => [...prev, { ...input, id: newId }])
    return newId
  }, [])

  const updateProject = useCallback((projectId: string, patch: Partial<Project>) => {
    setProjects((prev) => prev.map((p) => (p.id === projectId ? { ...p, ...patch } : p)))
  }, [])

  const updatePreferences = useCallback((patch: Partial<Preferences>) => {
    setPreferences((prev) => ({ ...prev, ...patch }))
  }, [])

  const openTask = useCallback((taskId: string) => setOpenTaskId(taskId), [])
  const closeTask = useCallback(() => setOpenTaskId(null), [])

  const openAddTaskModal = useCallback((defaults?: Partial<NewTaskInput>) => {
    setAddTaskModal({ open: true, defaults })
  }, [])
  const closeAddTaskModal = useCallback(() => setAddTaskModal({ open: false }), [])

  const value = useMemo<AppContextValue>(
    () => ({
      tasks,
      projects,
      preferences,
      currentUserId,
      addTask,
      updateTask,
      deleteTask,
      toggleComplete,
      addProject,
      updateProject,
      updatePreferences,
      toasts,
      showToast,
      dismissToast,
      openTaskId,
      openTask,
      closeTask,
      addTaskModal,
      openAddTaskModal,
      closeAddTaskModal,
    }),
    [
      tasks,
      projects,
      preferences,
      addTask,
      updateTask,
      deleteTask,
      toggleComplete,
      addProject,
      updateProject,
      updatePreferences,
      toasts,
      showToast,
      dismissToast,
      openTaskId,
      openTask,
      closeTask,
      addTaskModal,
      openAddTaskModal,
      closeAddTaskModal,
    ],
  )

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within an AppProvider')
  return ctx
}
