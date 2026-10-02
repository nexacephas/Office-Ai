import type { MeetingActionItem } from '../meetingTypes'
import MeetingIcon from './MeetingIcon'
import './MeetingActionItems.css'

interface MeetingActionItemsProps {
  items: MeetingActionItem[]
  onCreateTask: (item: MeetingActionItem) => void
  onToggleComplete: (item: MeetingActionItem) => void
  onCreateAll: () => void
}

function dueLabel(date: string): string {
  return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(`${date}T12:00:00`))
}

export default function MeetingActionItems({ items, onCreateTask, onToggleComplete, onCreateAll }: MeetingActionItemsProps) {
  const pending = items.filter((item) => !item.taskCreated && item.status !== 'completed').length
  return <section className="meeting-action-items-section"><div className="meeting-detail-section-heading"><div><h3>Action items</h3><p>Turn decisions into owned follow-ups.</p></div>{pending > 0 && <button type="button" className="meeting-text-action" onClick={onCreateAll}>Create all tasks</button>}</div>{items.length ? <div className="meeting-action-item-list">{items.map((item) => <article className={`meeting-action-item ${item.status === 'completed' ? 'is-complete' : ''}`} key={item.id}><button type="button" className={`meeting-action-check ${item.status === 'completed' ? 'is-checked' : ''}`} aria-label={`${item.status === 'completed' ? 'Reopen' : 'Complete'} ${item.title}`} aria-pressed={item.status === 'completed'} onClick={() => onToggleComplete(item)}>{item.status === 'completed' && <MeetingIcon name="check" size={13} />}</button><div className="meeting-action-item-main"><strong>{item.title}</strong><div><span>Owner: {item.owner}</span><span>Due: {dueLabel(item.dueDate)}</span></div></div>{item.taskCreated ? <span className="meeting-task-created"><MeetingIcon name="check" size={13} />Task created</span> : <button type="button" className="meeting-secondary-button" onClick={() => onCreateTask(item)}><MeetingIcon name="plus" size={13} />Create Task</button>}</article>)}</div> : <p className="meeting-action-empty">No action items have been added yet.</p>}</section>
}