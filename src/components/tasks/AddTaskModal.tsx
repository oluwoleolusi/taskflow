import { useEffect, useRef, useState } from 'react'
import type { FormEvent } from 'react'
import type { NewTaskInput, Priority, TaskStatus } from '../../types'
import { useApp } from '../../context/AppContext'
import Modal from '../ui/Modal'
import { STATUS_LABELS, STATUS_ORDER, PRIORITY_LABELS, PRIORITY_ORDER } from '../../utils/labels'
import { users } from '../../data/users'

const emptyForm = {
  title: '',
  description: '',
  projectId: '',
  priority: 'medium' as Priority,
  status: 'todo' as TaskStatus,
  dueDate: '',
  assigneeId: '',
}

export default function AddTaskModal() {
  const { addTaskModal, closeAddTaskModal, addTask, projects, showToast } = useApp()
  const [form, setForm] = useState(emptyForm)
  const [titleError, setTitleError] = useState<string | undefined>()
  const titleRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (addTaskModal.open) {
      setForm({
        ...emptyForm,
        projectId: addTaskModal.defaults?.projectId ?? projects[0]?.id ?? '',
        status: addTaskModal.defaults?.status ?? 'todo',
        priority: addTaskModal.defaults?.priority ?? 'medium',
        dueDate: addTaskModal.defaults?.dueDate ?? '',
        assigneeId: addTaskModal.defaults?.assigneeId ?? '',
      })
      setTitleError(undefined)
      window.setTimeout(() => titleRef.current?.focus(), 10)
    }
  }, [addTaskModal, projects])

  function update<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!form.title.trim()) {
      setTitleError('Give the task a title.')
      titleRef.current?.focus()
      return
    }

    const input: NewTaskInput = {
      title: form.title.trim(),
      description: form.description.trim() || undefined,
      projectId: form.projectId,
      priority: form.priority,
      status: form.status,
      dueDate: form.dueDate || undefined,
      assigneeId: form.assigneeId || undefined,
    }
    addTask(input)
    closeAddTaskModal()
    showToast('Task created')
  }

  return (
    <Modal
      open={addTaskModal.open}
      onClose={closeAddTaskModal}
      title="Add task"
      labelledById="add-task-title"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="task-title" className="field-label">
            Title
          </label>
          <input
            ref={titleRef}
            id="task-title"
            type="text"
            value={form.title}
            onChange={(e) => {
              update('title', e.target.value)
              if (titleError) setTitleError(undefined)
            }}
            aria-invalid={Boolean(titleError)}
            aria-describedby={titleError ? 'task-title-error' : undefined}
            className={`mt-1.5 field-input ${titleError ? 'border-danger' : ''}`}
            placeholder="e.g. Review homepage copy"
          />
          {titleError && (
            <p id="task-title-error" className="mt-1 text-xs text-danger">
              {titleError}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="task-description" className="field-label">
            Description <span className="text-ink-faint">(optional)</span>
          </label>
          <textarea
            id="task-description"
            rows={3}
            value={form.description}
            onChange={(e) => update('description', e.target.value)}
            className="mt-1.5 field-input"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="task-project" className="field-label">
              Project
            </label>
            <select
              id="task-project"
              value={form.projectId}
              onChange={(e) => update('projectId', e.target.value)}
              className="mt-1.5 field-input"
            >
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="task-status" className="field-label">
              Status
            </label>
            <select
              id="task-status"
              value={form.status}
              onChange={(e) => update('status', e.target.value as TaskStatus)}
              className="mt-1.5 field-input"
            >
              {STATUS_ORDER.map((s) => (
                <option key={s} value={s}>
                  {STATUS_LABELS[s]}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="task-priority" className="field-label">
              Priority
            </label>
            <select
              id="task-priority"
              value={form.priority}
              onChange={(e) => update('priority', e.target.value as Priority)}
              className="mt-1.5 field-input"
            >
              {PRIORITY_ORDER.map((p) => (
                <option key={p} value={p}>
                  {PRIORITY_LABELS[p]}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="task-due" className="field-label">
              Due date <span className="text-ink-faint">(optional)</span>
            </label>
            <input
              id="task-due"
              type="date"
              value={form.dueDate}
              onChange={(e) => update('dueDate', e.target.value)}
              className="mt-1.5 field-input"
            />
          </div>

          <div className="col-span-2">
            <label htmlFor="task-assignee" className="field-label">
              Assignee <span className="text-ink-faint">(optional)</span>
            </label>
            <select
              id="task-assignee"
              value={form.assigneeId}
              onChange={(e) => update('assigneeId', e.target.value)}
              className="mt-1.5 field-input"
            >
              <option value="">Unassigned</option>
              {users.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 border-t border-border pt-4">
          <button type="button" onClick={closeAddTaskModal} className="btn-secondary">
            Cancel
          </button>
          <button type="submit" className="btn-primary">
            Add task
          </button>
        </div>
      </form>
    </Modal>
  )
}
