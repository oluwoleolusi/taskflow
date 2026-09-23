import { useState } from 'react'
import type { FormEvent } from 'react'
import { useApp } from '../context/AppContext'
import PageHeader from '../components/ui/PageHeader'
import Avatar from '../components/ui/Avatar'
import { getUserById } from '../data/users'

function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean
  onChange: (v: boolean) => void
  label: string
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={`relative h-6 w-11 shrink-0 rounded-full transition-colors duration-150 ease-app ${
        checked ? 'bg-accent' : 'bg-border'
      }`}
    >
      <span
        className={`absolute top-0.5 h-5 w-5 rounded-full bg-surface shadow-sm transition-transform duration-150 ease-app ${
          checked ? 'translate-x-[22px]' : 'translate-x-0.5'
        }`}
      />
    </button>
  )
}

export default function Settings() {
  const { preferences, updatePreferences, currentUserId, showToast } = useApp()
  const [name, setName] = useState(preferences.name)
  const [email, setEmail] = useState(preferences.email)
  const user = getUserById(currentUserId)

  function handleProfileSubmit(e: FormEvent) {
    e.preventDefault()
    updatePreferences({ name: name.trim() || preferences.name, email: email.trim() || preferences.email })
    showToast('Changes saved')
  }

  return (
    <div>
      <PageHeader title="Settings" />

      <div className="mx-auto max-w-2xl space-y-8 px-4 py-4 sm:px-6">
        <section className="panel p-5">
          <h2 className="text-sm font-semibold text-ink">Profile</h2>
          <form onSubmit={handleProfileSubmit} className="mt-4 space-y-4">
            <div className="flex items-center gap-3">
              <Avatar user={user} size="md" />
              <p className="text-sm text-ink-soft">Avatar is generated from your name.</p>
            </div>

            <div>
              <label htmlFor="settings-name" className="field-label">
                Name
              </label>
              <input
                id="settings-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1.5 field-input"
              />
            </div>

            <div>
              <label htmlFor="settings-email" className="field-label">
                Email
              </label>
              <input
                id="settings-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1.5 field-input"
              />
            </div>

            <button type="submit" className="btn-primary">
              Save changes
            </button>
          </form>
        </section>

        <section className="panel p-5">
          <h2 className="text-sm font-semibold text-ink">Preferences</h2>
          <div className="mt-4 space-y-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm text-ink">Theme</p>
                <p className="text-xs text-ink-soft">Switch between light and dark surfaces.</p>
              </div>
              <select
                value={preferences.theme}
                onChange={(e) =>
                  updatePreferences({ theme: e.target.value as 'light' | 'dark' })
                }
                className="field-input w-auto"
                aria-label="Theme"
              >
                <option value="light">Light</option>
                <option value="dark">Dark</option>
              </select>
            </div>

            <div className="flex items-center justify-between gap-4 border-t border-border-soft pt-4">
              <div>
                <p className="text-sm text-ink">Date format</p>
                <p className="text-xs text-ink-soft">Used across task due dates.</p>
              </div>
              <select
                value={preferences.dateFormat}
                onChange={(e) =>
                  updatePreferences({ dateFormat: e.target.value as 'MDY' | 'DMY' })
                }
                className="field-input w-auto"
                aria-label="Date format"
              >
                <option value="MDY">MM/DD/YYYY</option>
                <option value="DMY">DD/MM/YYYY</option>
              </select>
            </div>

            <div className="flex items-center justify-between gap-4 border-t border-border-soft pt-4">
              <div>
                <p className="text-sm text-ink">Start of week</p>
                <p className="text-xs text-ink-soft">Applies to the calendar view.</p>
              </div>
              <select
                value={preferences.startOfWeek}
                onChange={(e) =>
                  updatePreferences({ startOfWeek: e.target.value as 'sunday' | 'monday' })
                }
                className="field-input w-auto"
                aria-label="Start of week"
              >
                <option value="sunday">Sunday</option>
                <option value="monday">Monday</option>
              </select>
            </div>
          </div>
        </section>

        <section className="panel p-5">
          <h2 className="text-sm font-semibold text-ink">Notifications</h2>
          <div className="mt-4 space-y-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm text-ink">Email notifications</p>
                <p className="text-xs text-ink-soft">Summary emails about project activity.</p>
              </div>
              <Toggle
                checked={preferences.emailNotifications}
                onChange={(v) => updatePreferences({ emailNotifications: v })}
                label="Email notifications"
              />
            </div>
            <div className="flex items-center justify-between gap-4 border-t border-border-soft pt-4">
              <div>
                <p className="text-sm text-ink">Task reminders</p>
                <p className="text-xs text-ink-soft">Reminders for tasks due soon.</p>
              </div>
              <Toggle
                checked={preferences.taskReminders}
                onChange={(v) => updatePreferences({ taskReminders: v })}
                label="Task reminders"
              />
            </div>
            <div className="flex items-center justify-between gap-4 border-t border-border-soft pt-4">
              <div>
                <p className="text-sm text-ink">Assignment notifications</p>
                <p className="text-xs text-ink-soft">When someone assigns you a task.</p>
              </div>
              <Toggle
                checked={preferences.assignmentNotifications}
                onChange={(v) => updatePreferences({ assignmentNotifications: v })}
                label="Assignment notifications"
              />
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
