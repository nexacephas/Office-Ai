import { useState } from 'react'
import type { FormEvent, KeyboardEvent as ReactKeyboardEvent } from 'react'
import type { Task, TaskPriority, TaskStatus } from '../taskTypes'

interface TaskFormValues {
  title: string
  description: string
  status: TaskStatus
  priority: TaskPriority
  dueDate: string
  assignee: string
  relatedDocument: string
  notes: string
}

interface CreateTaskModalProps {
  task: Task | null
  onClose: () => void
  onSave: (values: TaskFormValues) => void
}

function trapDialogFocus(event: ReactKeyboardEvent<HTMLElement>) {
  if (event.key !== 'Tab') return
  const focusable = Array.from(event.currentTarget.querySelectorAll<HTMLElement>('button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [href], [tabindex]:not([tabindex="-1"])'))
  const first = focusable[0]
  const last = focusable[focusable.length - 1]
  if (!first || !last) return
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault()
    last.focus()
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault()
    first.focus()
  }
}

export default function CreateTaskModal({ task, onClose, onSave }: CreateTaskModalProps) {
  const [values, setValues] = useState<TaskFormValues>(() => ({
    title: task?.title ?? '',
    description: task?.description ?? '',
    status: task?.status ?? 'To Do',
    priority: task?.priority ?? 'Medium',
    dueDate: task?.dueDate ?? '',
    assignee: task?.assignee ?? 'Cephas',
    relatedDocument: task?.relatedDocument ?? '',
    notes: task?.notes ?? '',
  }))
  const [error, setError] = useState('')

  function setField<Key extends keyof TaskFormValues>(key: Key, value: TaskFormValues[Key]) {
    setValues((current) => ({ ...current, [key]: value }))
    if (error) setError('')
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!values.title.trim()) {
      setError('Enter a task title to continue.')
      return
    }
    if (!values.dueDate) {
      setError('Choose a due date to continue.')
      return
    }
    onSave({ ...values, title: values.title.trim(), description: values.description.trim(), notes: values.notes.trim() })
  }

  return (
    <div className="task-dialog-layer task-create-layer">
      <button type="button" className="task-dialog-backdrop" aria-label="Close create task dialog" onClick={onClose} />
      <section className="task-create-modal" role="dialog" aria-modal="true" aria-labelledby="task-create-title" onKeyDown={trapDialogFocus}>
        <header className="task-create-modal__header">
          <div><span className="task-detail-kicker">YOUR WORKSPACE</span><h2 id="task-create-title">{task ? 'Edit task' : 'Create a task'}</h2><p>Keep the next step clear and easy to find.</p></div>
          <button type="button" className="task-icon-button" aria-label="Close dialog" onClick={onClose}><svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="m18 6-12 12M6 6l12 12" /></svg></button>
        </header>
        <form onSubmit={submit} noValidate>
          <div className="task-form-grid">
            <label className="task-form-field task-form-field--wide"><span>Task title <i>*</i></span><input autoFocus value={values.title} onChange={(event) => setField('title', event.target.value)} placeholder="What needs to get done?" aria-required="true" aria-invalid={Boolean(error && !values.title.trim())} /></label>
            <label className="task-form-field task-form-field--wide"><span>Description</span><textarea rows={3} value={values.description} onChange={(event) => setField('description', event.target.value)} placeholder="Add a little context for your team" /></label>
            <label className="task-form-field"><span>Status</span><select value={values.status} onChange={(event) => setField('status', event.target.value as TaskStatus)}><option>To Do</option><option>In Progress</option><option>Waiting</option><option>Completed</option></select></label>
            <label className="task-form-field"><span>Priority</span><select value={values.priority} onChange={(event) => setField('priority', event.target.value as TaskPriority)}><option>Low</option><option>Medium</option><option>High</option></select></label>
            <label className="task-form-field"><span>Due date <i>*</i></span><input type="date" value={values.dueDate} onChange={(event) => setField('dueDate', event.target.value)} aria-required="true" aria-invalid={Boolean(error && !values.dueDate)} /></label>
            <label className="task-form-field"><span>Assignee</span><select value={values.assignee} onChange={(event) => setField('assignee', event.target.value)}><option>Cephas</option><option>Sarah Chen</option><option>Jordan Lee</option></select></label>
            <label className="task-form-field task-form-field--wide"><span>Related document</span><input value={values.relatedDocument} onChange={(event) => setField('relatedDocument', event.target.value)} placeholder="Search or enter a document name" /></label>
            <label className="task-form-field task-form-field--wide"><span>Notes</span><textarea rows={3} value={values.notes} onChange={(event) => setField('notes', event.target.value)} placeholder="Additional instructions or context" /></label>
          </div>
          {error && <p className="task-form-error" role="alert">{error}</p>}
          <footer className="task-create-modal__footer"><span><i>*</i> Required fields</span><div><button type="button" className="task-cancel-button" onClick={onClose}>Cancel</button><button type="submit" className="tasks-create-button">{task ? 'Save changes' : 'Create Task'}</button></div></footer>
        </form>
      </section>
    </div>
  )
}