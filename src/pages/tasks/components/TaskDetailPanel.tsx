import type { KeyboardEvent as ReactKeyboardEvent } from 'react'
import type { Task, TaskStatus } from '../taskTypes'

interface TaskDetailPanelProps {
  task: Task
  overdue: boolean
  onClose: () => void
  onEdit: () => void
  onDelete: () => void
  onStatusChange: (status: TaskStatus) => void
  onToggleSubtask: (subtaskId: string) => void
  onToggleComplete: () => void
}

const statusOptions: TaskStatus[] = ['To Do', 'In Progress', 'Waiting', 'Completed']

function formatDate(dateString: string): string {
  return new Intl.DateTimeFormat('en-US', { month: 'long', day: 'numeric', year: 'numeric' }).format(new Date(`${dateString}T12:00:00`))
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

export default function TaskDetailPanel({ task, overdue, onClose, onEdit, onDelete, onStatusChange, onToggleSubtask, onToggleComplete }: TaskDetailPanelProps) {
  const completedSubtasks = task.subtasks.filter((subtask) => subtask.completed).length
  return (
    <div className="task-dialog-layer">
      <button type="button" className="task-dialog-backdrop" aria-label="Close task details" onClick={onClose} />
      <aside className="task-detail-panel" role="dialog" aria-modal="true" aria-labelledby="task-detail-title" onKeyDown={trapDialogFocus}>
        <header className="task-detail-header">
          <span className="task-detail-kicker">TASK DETAILS</span>
          <button type="button" autoFocus className="task-icon-button task-detail-close" aria-label="Close task details" onClick={onClose}><svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="m18 6-12 12M6 6l12 12" /></svg></button>
        </header>
        <div className="task-detail-scroll">
          <div className="task-detail-title-row">
            <label className="task-detail-check"><input type="checkbox" checked={task.status === 'Completed'} onChange={onToggleComplete} aria-label="Mark task complete" /><span /></label>
            <h2 id="task-detail-title">{task.title}</h2>
          </div>
          <p className="task-detail-description">{task.description}</p>
          <div className="task-detail-primary-actions">
            <button type="button" className="task-create-button task-detail-edit" onClick={onEdit}>Edit task</button>
            {task.status !== 'Completed' && <button type="button" className="task-detail-complete" onClick={onToggleComplete}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m5 12 4 4L19 6" /></svg>Mark complete</button>}
          </div>

          <section className="task-detail-section" aria-labelledby="task-properties-heading">
            <h3 id="task-properties-heading">Task properties</h3>
            <dl className="task-properties">
              <div><dt>Status</dt><dd><label className="task-detail-select-wrap"><span className={`task-status-dot status-${task.status.toLowerCase().replace(' ', '-')}`} /><select aria-label="Change task status" value={task.status} onChange={(event) => onStatusChange(event.target.value as TaskStatus)}>{statusOptions.map((status) => <option key={status}>{status}</option>)}</select></label></dd></div>
              <div><dt>Priority</dt><dd><span className={`task-priority priority-${task.priority.toLowerCase()}`}><i />{task.priority}</span></dd></div>
              <div><dt>Due date</dt><dd className={overdue ? 'task-property-overdue' : ''}>{formatDate(task.dueDate)}{overdue && <span className="task-overdue-label">Overdue</span>}</dd></div>
              <div><dt>Assignee</dt><dd><span className="task-avatar">{task.assignee.split(' ').map((part) => part[0]).join('').slice(0, 2)}</span>{task.assignee}</dd></div>
              <div><dt>Created by</dt><dd>{task.createdBy}</dd></div>
              <div><dt>Created</dt><dd>{formatDate(task.createdDate)}</dd></div>
              {task.relatedDocument && <div className="task-property-document"><dt>Related document</dt><dd><span className="task-document-icon">DOC</span>{task.relatedDocument}</dd></div>}
            </dl>
          </section>

          {task.notes && <section className="task-detail-section"><h3>Notes</h3><p className="task-detail-notes">{task.notes}</p></section>}
          {task.subtasks.length > 0 && <section className="task-detail-section"><div className="task-subtasks-heading"><h3>Subtasks</h3><span>{completedSubtasks}/{task.subtasks.length}</span></div><div className="task-subtasks-list">{task.subtasks.map((subtask) => <label key={subtask.id} className={`task-subtask ${subtask.completed ? 'is-complete' : ''}`}><input type="checkbox" checked={subtask.completed} onChange={() => onToggleSubtask(subtask.id)} /><span className="task-subtask-check" /><span>{subtask.title}</span></label>)}</div></section>}
          <section className="task-detail-section task-activity-section"><h3>Activity</h3><ol className="task-activity-list">{task.activity.map((activity) => <li key={activity.id}><span className="task-activity-marker" /><div><p>{activity.message}</p><time>{activity.dateLabel}</time></div></li>)}</ol></section>
          <button type="button" className="task-delete-button" onClick={onDelete}>Delete task</button>
        </div>
      </aside>
    </div>
  )
}