import { useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import {
  Sun,
  CheckSquare,
  LayoutGrid,
  CalendarDays,
  MoreHorizontal,
  Plus,
  Calendar,
  Folder,
  Settings,
} from 'lucide-react'
import { useApp } from '../../context/AppContext'
import Drawer from '../ui/Drawer'
import Avatar from '../ui/Avatar'
import { getUserById } from '../../data/users'

const tabs = [
  { to: '/today', label: 'Today', icon: Sun },
  { to: '/my-tasks', label: 'Tasks', icon: CheckSquare },
  { to: '/board', label: 'Board', icon: LayoutGrid },
  { to: '/calendar', label: 'Calendar', icon: CalendarDays },
]

const moreLinks = [
  { to: '/upcoming', label: 'Upcoming', icon: Calendar },
  { to: '/projects', label: 'Projects', icon: Folder },
  { to: '/settings', label: 'Settings', icon: Settings },
]

export default function MobileNav() {
  const [moreOpen, setMoreOpen] = useState(false)
  const { projects, preferences, currentUserId, openAddTaskModal } = useApp()
  const location = useLocation()
  const user = getUserById(currentUserId)

  const isMoreActive = moreLinks.some((l) => location.pathname.startsWith(l.to))

  return (
    <>
      <header className="flex h-14 items-center justify-between border-b border-border bg-surface px-4 lg:hidden">
        <span className="flex items-center gap-2">
          <span className="flex h-6 w-6 items-center justify-center rounded bg-accent text-xs font-bold text-white">
            T
          </span>
          <span className="text-sm font-semibold text-ink">TaskFlow</span>
        </span>
        <button
          type="button"
          onClick={() => openAddTaskModal()}
          aria-label="Add task"
          className="icon-btn"
        >
          <Plus className="h-5 w-5" aria-hidden="true" />
        </button>
      </header>

      <nav
        className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-5 border-t border-border bg-surface pb-[env(safe-area-inset-bottom)] lg:hidden"
        aria-label="Primary"
      >
        {tabs.map((tab) => (
          <NavLink
            key={tab.to}
            to={tab.to}
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 py-2.5 text-[0.65rem] font-medium ${
                isActive ? 'text-accent' : 'text-ink-faint'
              }`
            }
          >
            <tab.icon className="h-5 w-5" aria-hidden="true" />
            {tab.label}
          </NavLink>
        ))}
        <button
          type="button"
          onClick={() => setMoreOpen(true)}
          className={`flex flex-col items-center gap-1 py-2.5 text-[0.65rem] font-medium ${
            isMoreActive ? 'text-accent' : 'text-ink-faint'
          }`}
        >
          <MoreHorizontal className="h-5 w-5" aria-hidden="true" />
          More
        </button>
      </nav>

      <Drawer open={moreOpen} onClose={() => setMoreOpen(false)} labelledById="more-menu-title">
        <div className="p-5">
          <h2 id="more-menu-title" className="text-base font-semibold text-ink">
            Menu
          </h2>

          <div className="mt-5 space-y-0.5">
            {moreLinks.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setMoreOpen(false)}
                className={({ isActive }) => `nav-link ${isActive ? 'nav-link-active' : ''}`}
              >
                <item.icon className="h-4 w-4" aria-hidden="true" />
                {item.label}
              </NavLink>
            ))}
          </div>

          <div className="mt-6">
            <p className="px-2.5 text-xs font-medium uppercase tracking-wide text-ink-faint">
              Projectss
            </p>
            <div className="mt-1.5 space-y-0.5">
              {projects.map((project) => (
                <NavLink
                  key={project.id}
                  to={`/projects/${project.id}`}
                  onClick={() => setMoreOpen(false)}
                  className={({ isActive }) => `nav-link ${isActive ? 'nav-link-active' : ''}`}
                >
                  <span className="h-2 w-2 shrink-0 rounded-full bg-accent" aria-hidden="true" />
                  <span className="truncate">{project.name}</span>
                </NavLink>
              ))}
            </div>
          </div>

          <div className="mt-6 flex items-center gap-2.5 border-t border-border pt-5">
            <Avatar user={user} size="sm" />
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm font-medium text-ink">
                {preferences.name}
              </span>
              <span className="block truncate text-xs text-ink-soft">{preferences.email}</span>
            </span>
          </div>
        </div>
      </Drawer>
    </>
  )
}
