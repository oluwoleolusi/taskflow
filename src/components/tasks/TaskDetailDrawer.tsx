import { useEffect, useState } from 'react'
import { Plus, X, Trash2 } from 'lucide-react'
import type { Priority, TaskStatus } from '../../types'
import { useApp } from '../../context/AppContext'
import { getProjectById } from '../../data/projects'
import { users } from '../../data/users'
import { formatFullDate } from '../../utils/dates'
import { STATUS_LABELS, STATUS_ORDER, PRIORITY_LABELS, PRIORITY_ORDER } from '../../utils/labels'
import Drawer from '../ui/Drawer'
import TaskCheckbox from '../ui/TaskCheckbox'

export default function TaskDetailDrawer() {
  const { openTaskId, closeTask, tasks, updateTask, deleteTask, toggleComplete, showToast } =
    useApp()
  const task = tasks.find((t) => t.id === openTaskId)

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [tagInput, setTagInput] = useState('')
  const [subtaskInput, setSubtaskInput] = useState('')
  const [confirmingDelete, setConfirmingDelete] = useState(false)

  useEffect(() => {
    if (task) {
      setTitle(task.title)
      setDescription(task.description ?? '')
      setConfirmingDelete(false)
    }
  }, [task?.id]) // eslint-disable-line react-hooks/exhaustive-deps

  if (!task) {
    return <Drawer open={false} onClose={closeTask} labelledById="task-drawer-title" />
  }

  const project = getProjectById(task.projectId)

  function commitTitle() {
    if (!task) return
    const trimmed = title.trim()
    if (trimmed && trimmed !== task.title) {
      updateTask(task.id, { title: trimmed })
    } else {
      setTitle(task.title)
    }
  }

  function commitDescription() {
    if (!task) return
    if (description !== (task.description ?? '')) {
      updateTask(task.id, { description: description || undefined })
    }
  }

  function addTag() {
    if (!task) return
    const value = tagInput.trim()
    if (!value) return
    if (!task.tags.includes(value)) {
      updateTask(task.id, { tags: [...task.tags, value] })
    }
    setTagInput('')
  }

  function removeTag(tag: string) {
    if (!task) return
    updateTask(task.id, { tags: task.tags.filter((t) => t !== tag) })
  }

  function addSubtask() {
    if (!task) return
    const value = subtaskInput.trim()
    if (!value) return
    updateTask(task.id, {
      subtasks: [...task.subtasks, { id: `st-${Date.now()}`, title: value, completed: false }],
    })
    setSubtaskInput('')
  }

  function toggleSubtask(subtaskId: string) {
    if (!task) return
    updateTask(task.id, {
      subtasks: task.subtasks.map((s) =>
        s.id === subtaskId ? { ...s, completed: !s.completed } : s,
      ),
    })
  }

  function removeSubtask(subtaskId: string) {
    if (!task) return
    updateTask(task.id, { subtasks: task.subtasks.filter((s) => s.id !== subtaskId) })
  }

  function handleDelete() {
    if (!task) return
    deleteTask(task.id)
    closeTask()
    showToast('Task deleted')
  }

  return (
    <Drawer open={Boolean(openTaskId)} onClose={closeTask} labelledById="task-drawer-title">
      <div className="p-6">
        <div className="flex items-start gap-3 pr-8">
          <div className="pt-1">
            <TaskCheckbox
              checked={task.status === 'done'}
              onChange={() => toggleComplete(task.id)}
              label={task.title}
            />
          </div>
          <input
            id="task-drawer-title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={commitTitle}
            className={`w-full border-none bg-transparent p-0 text-lg font-semibold text-ink outline-none focus:ring-0 ${
              task.status === 'done' ? 'text-ink-faint line-through' : ''
            }`}
          />
        </div>

        {project && (
          <p className="mt-2 pl-8 text-sm text-ink-soft">
            in <span className="font-medium text-ink">{project.name}</span>
          </p>
        )}

        <div className="mt-6 grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="drawer-status" className="field-label">
              Status
            </label>
            <select
              id="drawer-status"
              value={task.status}
              onChange={(e) => updateTask(task.id, { status: e.target.value as TaskStatus })}
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
            <label htmlFor="drawer-priority" className="field-label">
              Priority
            </label>
            <select
              id="drawer-priority"
              value={task.priority}
              onChange={(e) => updateTask(task.id, { priority: e.target.value as Priority })}
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
            <label htmlFor="drawer-assignee" className="field-label">
              Assignee
            </label>
            <select
              id="drawer-assignee"
              value={task.assigneeId ?? ''}
              onChange={(e) => updateTask(task.id, { assigneeId: e.target.value || undefined })}
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

          <div>
            <label htmlFor="drawer-due" className="field-label">
              Due date
            </label>
            <input
              id="drawer-due"
              type="date"
              value={task.dueDate ?? ''}
              onChange={(e) => updateTask(task.id, { dueDate: e.target.value || undefined })}
              className="mt-1.5 field-input"
            />
          </div>
        </div>

        <div className="mt-6">
          <label htmlFor="drawer-description" className="field-label">
            Description
          </label>
          <textarea
            id="drawer-description"
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            onBlur={commitDescription}
            placeholder="Add a description..."
            className="mt-1.5 field-input"
          />
        </div>

        <div className="mt-6">
          <p className="field-label">Tags</p>
          <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
            {task.tags.map((tag) => (
              <span
                key={tag}
                className="flex items-center gap-1 rounded border border-border-soft bg-app px-2 py-1 text-xs text-ink-soft"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => removeTag(tag)}
                  aria-label={`Remove tag ${tag}`}
                  className="text-ink-faint hover:text-danger"
                >
                  <X className="h-3 w-3" aria-hidden="true" />
                </button>
              </span>
            ))}
            <input
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  addTag()
                }
              }}
              placeholder="Add tag"
              aria-label="Add tag"
              className="w-24 border-b border-border bg-transparent px-1 py-1 text-xs text-ink outline-none focus:border-accent"
            />
          </div>
        </div>

        <div className="mt-6">
          <p className="field-label">
            Subtasks{' '}
            {task.subtasks.length > 0 && (
              <span className="text-ink-faint">
                ({task.subtasks.filter((s) => s.completed).length}/{task.subtasks.length})
              </span>
            )}
          </p>
          <div className="mt-2 space-y-1.5">
            {task.subtasks.map((subtask) => (
              <div key={subtask.id} className="flex items-center gap-2.5">
                <TaskCheckbox
                  checked={subtask.completed}
                  onChange={() => toggleSubtask(subtask.id)}
                  label={subtask.title}
                />
                <span
                  className={`flex-1 text-sm ${
                    subtask.completed ? 'text-ink-faint line-through' : 'text-ink'
                  }`}
                >
                  {subtask.title}
                </span>
                <button
                  type="button"
                  onClick={() => removeSubtask(subtask.id)}
                  aria-label={`Remove subtask ${subtask.title}`}
                  className="icon-btn h-6 w-6"
                >
                  <X className="h-3.5 w-3.5" aria-hidden="true" />
                </button>
              </div>
            ))}
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              addSubtask()
            }}
            className="mt-2 flex items-center gap-2"
          >
            <input
              value={subtaskInput}
              onChange={(e) => setSubtaskInput(e.target.value)}
              placeholder="Add subtask"
              aria-label="Add subtask"
              className="field-input"
            />
            <button type="submit" className="icon-btn shrink-0 border border-border">
              <Plus className="h-4 w-4" aria-hidden="true" />
            </button>
          </form>
        </div>

        <div className="mt-6 border-t border-border pt-4">
          <p className="field-label">Activity</p>
          <p className="mt-2 text-sm text-ink-soft">
            Created {formatFullDate(task.createdAt)}
          </p>
        </div>

        <div className="mt-8 border-t border-border pt-5">
          {confirmingDelete ? (
            <div className="flex items-center gap-2">
              <p className="flex-1 text-sm text-ink-soft">Delete this task?</p>
              <button type="button" onClick={() => setConfirmingDelete(false)} className="btn-secondary">
                Cancel
              </button>
              <button type="button" onClick={handleDelete} className="btn-primary bg-danger hover:bg-danger">
                Delete
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setConfirmingDelete(true)}
              className="btn-danger-ghost"
            >
              <Trash2 className="h-4 w-4" aria-hidden="true" />
              Delete task
            </button>
          )}
        </div>
      </div>
    </Drawer>
  )
}
