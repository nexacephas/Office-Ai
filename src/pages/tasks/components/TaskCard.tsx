import { useState } from 'react'
import type { Task, TaskStatus } from '../taskTypes'

interface TaskCardProps {
  task: Task
  today: string
  overdue: boolean
  onOpen: () => void
  onToggleComplete: () => void
  onEdit: () => void
  onDelete: () => void
  onStatusChange: (status: TaskStatus) => void
}

function Icon({ name }: { name: 'more' | 'calendar' | 'file' }) {
  const paths = {
    more: <><circle cx="5" cy="12" r="1" fill="currentColor" /><circle cx="12" cy="12" r="1" fill="currentColor" /><circle cx="19" cy="12" r="1" fill="currentColor" /></>,
    calendar: <><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M16 3v4M8 3v4M3 10h18" /></>,
    file: <><path d="M13 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V10z" /><path d="M13 3v7h7" /></>,
  }
  return <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>
}

function formatDate(dateString: string): string {
  return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(new Date(`${dateString}T12:00:00`))
}

export default function TaskCard({ task, today, overdue, onOpen, onToggleComplete, onEdit, onDelete, onStatusChange }: TaskCardProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const statusClass = task.status.toLowerCase().replace(' ', '-')
  const dueLabel = overdue ? `Overdue · ${formatDate(task.dueDate)}` : task.dueDate === today ? 'Due today' : formatDate(task.dueDate)

  return (
    <article className={`task-card ${task.status === 'Completed' ? 'is-completed' : ''} ${overdue ? 'is-overdue' : ''}`}>
      <label className="task-card__check" aria-label={`${task.status === 'Completed' ? 'Reopen' : 'Complete'} ${task.title}`}>
        <input type="checkbox" checked={task.status === 'Completed'} onChange={onToggleComplete} />
        <span />
      </label>
      <div className="task-card__main">
        <div className="task-card__title-row">
          <button type="button" className="task-card__title" onClick={onOpen}>{task.title}</button>
          <div className="task-card__menu-wrap">
            <button type="button" className="task-icon-button" aria-label={`More actions for ${task.title}`} aria-expanded={menuOpen} onClick={() => setMenuOpen((open) => !open)}><Icon name="more" /></button>
            {menuOpen && <><button type="button" className="task-menu-dismiss" aria-label="Close task actions" onClick={() => setMenuOpen(false)} /><div className="task-card__menu" role="menu">
              <button type="button" role="menuitem" onClick={() => { setMenuOpen(false); onOpen() }}>View details</button>
              <button type="button" role="menuitem" onClick={() => { setMenuOpen(false); onEdit() }}>Edit task</button>
              {task.status !== 'In Progress' && <button type="button" role="menuitem" onClick={() => { setMenuOpen(false); onStatusChange('In Progress') }}>Move to In Progress</button>}
              <button type="button" role="menuitem" onClick={() => { setMenuOpen(false); onToggleComplete() }}>{task.status === 'Completed' ? 'Reopen task' : 'Mark complete'}</button>
              <button type="button" role="menuitem" className="is-danger" onClick={() => { setMenuOpen(false); onDelete() }}>Delete task</button>
            </div></>}
          </div>
        </div>
        <p className="task-card__description">{task.description}</p>
        <div className="task-card__meta">
          <span className={`task-status-badge status-${statusClass}`}>{task.status}</span>
          <span className={`task-priority priority-${task.priority.toLowerCase()}`}><i />{task.priority}</span>
          <span className={`task-due ${overdue ? 'is-overdue' : ''}`}><Icon name="calendar" />{dueLabel}</span>
          <span className="task-assignee"><span className="task-avatar">{task.assignee.split(' ').map((part) => part[0]).join('').slice(0, 2)}</span>{task.assignee}</span>
          {task.relatedDocument && <span className="task-related"><Icon name="file" />{task.relatedDocument}</span>}
        </div>
      </div>
    </article>
  )
}