import { useEffect, useRef, useState } from 'react'
import type { FormEvent } from 'react'
import type { ProjectStatus } from '../../types'
import { useApp } from '../../context/AppContext'
import Modal from '../ui/Modal'
import { PROJECT_STATUS_LABELS } from '../../utils/labels'
import { users, currentUserId } from '../../data/users'

interface Props {
  open: boolean
  onClose: () => void
}

const emptyForm = {
  name: '',
  description: '',
  status: 'active' as ProjectStatus,
  dueDate: '',
  memberIds: [currentUserId] as string[],
}

export default function AddProjectModal({ open, onClose }: Props) {
  const { addProject, showToast } = useApp()
  const [form, setForm] = useState(emptyForm)
  const [nameError, setNameError] = useState<string | undefined>()
  const nameRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (open) {
      setForm(emptyForm)
      setNameError(undefined)
      window.setTimeout(() => nameRef.current?.focus(), 10)
    }
  }, [open])

  function toggleMember(id: string) {
    setForm((prev) => ({
      ...prev,
      memberIds: prev.memberIds.includes(id)
        ? prev.memberIds.filter((m) => m !== id)
        : [...prev.memberIds, id],
    }))
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!form.name.trim()) {
      setNameError('Give the project a name.')
      nameRef.current?.focus()
      return
    }
    addProject({
      name: form.name.trim(),
      description: form.description.trim(),
      status: form.status,
      dueDate: form.dueDate || undefined,
      memberIds: form.memberIds,
    })
    onClose()
    showToast('Project created')
  }

  return (
    <Modal open={open} onClose={onClose} title="New project" labelledById="add-project-title">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="project-name" className="field-label">
            Name
          </label>
          <input
            ref={nameRef}
            id="project-name"
            type="text"
            value={form.name}
            onChange={(e) => {
              setForm((p) => ({ ...p, name: e.target.value }))
              if (nameError) setNameError(undefined)
            }}
            aria-invalid={Boolean(nameError)}
            className={`mt-1.5 field-input ${nameError ? 'border-danger' : ''}`}
            placeholder="e.g. Website Redesign"
          />
          {nameError && <p className="mt-1 text-xs text-danger">{nameError}</p>}
        </div>

        <div>
          <label htmlFor="project-description" className="field-label">
            Description
          </label>
          <textarea
            id="project-description"
            rows={2}
            value={form.description}
            onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
            className="mt-1.5 field-input"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="project-status" className="field-label">
              Status
            </label>
            <select
              id="project-status"
              value={form.status}
              onChange={(e) => setForm((p) => ({ ...p, status: e.target.value as ProjectStatus }))}
              className="mt-1.5 field-input"
            >
              {(Object.keys(PROJECT_STATUS_LABELS) as ProjectStatus[]).map((s) => (
                <option key={s} value={s}>
                  {PROJECT_STATUS_LABELS[s]}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="project-due" className="field-label">
              Due date <span className="text-ink-faint">(optional)</span>
            </label>
            <input
              id="project-due"
              type="date"
              value={form.dueDate}
              onChange={(e) => setForm((p) => ({ ...p, dueDate: e.target.value }))}
              className="mt-1.5 field-input"
            />
          </div>
        </div>

        <div>
          <p className="field-label">Members</p>
          <div className="mt-1.5 flex flex-wrap gap-2">
            {users.map((u) => {
              const selected = form.memberIds.includes(u.id)
              return (
                <button
                  key={u.id}
                  type="button"
                  onClick={() => toggleMember(u.id)}
                  aria-pressed={selected}
                  className={`rounded-md border px-2.5 py-1.5 text-xs font-medium transition-colors ${
                    selected
                      ? 'border-accent bg-accent-soft text-accent-strong'
                      : 'border-border text-ink-soft hover:border-ink-faint'
                  }`}
                >
                  {u.name}
                </button>
              )
            })}
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 border-t border-border pt-4">
          <button type="button" onClick={onClose} className="btn-secondary">
            Cancel
          </button>
          <button type="submit" className="btn-primary">
            Create project
          </button>
        </div>
      </form>
    </Modal>
  )
}
