import { useEffect, useRef, useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import {
  Sun,
  CheckSquare,
  Calendar,
  Folder,
  LayoutGrid,
  CalendarDays,
  Settings,
  ChevronDown,
  Check,
  Plus,
} from 'lucide-react'
import { useApp } from '../../context/AppContext'
import Avatar from '../ui/Avatar'
import { getUserById } from '../../data/users'

const primaryNav = [
  { to: '/today', label: 'Today', icon: Sun },
  { to: '/my-tasks', label: 'My Tasks', icon: CheckSquare },
  { to: '/upcoming', label: 'Upcoming', icon: Calendar },
  { to: '/projects', label: 'Projects', icon: Folder },
  { to: '/board', label: 'Board', icon: LayoutGrid },
  { to: '/calendar', label: 'Calendar', icon: CalendarDays },
]

export default function Sidebar() {
  const { projects, preferences, currentUserId, openAddTaskModal } = useApp()
  const [switcherOpen, setSwitcherOpen] = useState(false)
  const switcherRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()
  const user = getUserById(currentUserId)

  useEffect(() => {
    if (!switcherOpen) return
    function onClick(e: MouseEvent) {
      if (switcherRef.current && !switcherRef.current.contains(e.target as Node)) {
        setSwitcherOpen(false)
      }
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setSwitcherOpen(false)
    }
    window.addEventListener('mousedown', onClick)
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('mousedown', onClick)
      window.removeEventListener('keydown', onKey)
    }
  }, [switcherOpen])

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `nav-link ${isActive ? 'nav-link-active' : ''}`

  return (
    <aside className="hidden w-64 shrink-0 flex-col border-r border-border bg-surface lg:flex">
      <div className="relative border-b border-border p-3" ref={switcherRef}>
        <button
          type="button"
          onClick={() => setSwitcherOpen((v) => !v)}
          aria-expanded={switcherOpen}
          aria-haspopup="true"
          className="flex w-full items-center gap-2 rounded-md px-2 py-2 text-left transition-colors hover:bg-app"
        >
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-accent text-sm font-bold text-white">
            T
          </span>
          <span className="flex-1 truncate">
            <span className="block truncate text-sm font-semibold text-ink">TaskFlow</span>
            <span className="block truncate text-xs text-ink-soft">Northstar Studio</span>
          </span>
          <ChevronDown className="h-4 w-4 shrink-0 text-ink-faint" aria-hidden="true" />
        </button>

        {switcherOpen && (
          <div className="absolute left-3 right-3 top-[calc(100%-4px)] z-20 rounded-md border border-border bg-surface py-1 shadow-pop">
            <button
              type="button"
              onClick={() => setSwitcherOpen(false)}
              className="flex w-full items-center justify-between px-3 py-2 text-sm text-ink hover:bg-app"
            >
              Northstar Studio
              <Check className="h-4 w-4 text-accent" aria-hidden="true" />
            </button>
          </div>
        )}
      </div>

      <nav className="flex-1 overflow-y-auto p-3">
        <button
          type="button"
          onClick={() => openAddTaskModal()}
          className="btn-primary mb-4 w-full"
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
          Add task
        </button>

        <div className="space-y-0.5">
          {primaryNav.map((item) => (
            <NavLink key={item.to} to={item.to} end={item.to === '/projects'} className={linkClass}>
              <item.icon className="h-4 w-4" aria-hidden="true" strokeWidth={2} />
              {item.label}
            </NavLink>
          ))}
        </div>

        <div className="mt-6">
          <p className="px-2.5 text-xs font-medium uppercase tracking-wide text-ink-faint">
            Projects
          </p>
          <div className="mt-1.5 space-y-0.5">
            {projects.map((project) => (
              <NavLink key={project.id} to={`/projects/${project.id}`} className={linkClass}>
                <span
                  className="h-2 w-2 shrink-0 rounded-full"
                  style={{
                    backgroundColor:
                      project.status === 'active'
                        ? '#0D9488'
                        : project.status === 'on-hold'
                          ? '#D97706'
                          : '#8B8880',
                  }}
                  aria-hidden="true"
                />
                <span className="truncate">{project.name}</span>
              </NavLink>
            ))}
          </div>
        </div>
      </nav>

      <div className="border-t border-border p-3">
        <NavLink to="/settings" className={linkClass}>
          <Settings className="h-4 w-4" aria-hidden="true" />
          Settings
        </NavLink>
        <button
          type="button"
          onClick={() => navigate('/settings')}
          className="mt-1 flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-left transition-colors hover:bg-app"
        >
          <Avatar user={user} size="sm" />
          <span className="min-w-0 flex-1">
            <span className="block truncate text-sm font-medium text-ink">
              {preferences.name}
            </span>
            <span className="block truncate text-xs text-ink-soft">{preferences.email}</span>
          </span>
        </button>
      </div>
    </aside>
  )
}
