import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { Meeting, MeetingActionItem, MeetingNotes, MeetingStatus } from '../meetingTypes'
import MeetingIcon from './MeetingIcon'
import MeetingNotesPanel from './MeetingNotesPanel'
import MeetingActionItems from './MeetingActionItems'
import MeetingMinutesModal from './MeetingMinutesModal'
import './MeetingDetail.css'

interface MeetingDetailProps {
  meeting: Meeting
  onClose: () => void
  onStatusChange: (meeting: Meeting, status: MeetingStatus) => void
  onEdit: (meeting: Meeting) => void
  onSaveNotes: (meeting: Meeting, notes: MeetingNotes) => void
  onUseAgenda: (meeting: Meeting, agenda: string[]) => void
  onGenerateSummary: (meeting: Meeting) => void
  onToggleAction: (meeting: Meeting, item: MeetingActionItem) => void
  onCreateTask: (meeting: Meeting, item: MeetingActionItem) => void
  onCreateAllTasks: (meeting: Meeting) => void
  onAIAction: (meeting: Meeting, action: string) => void
}

function dateTime(meeting: Meeting): string {
  const date = new Intl.DateTimeFormat('en-US', { weekday: 'long', month: 'long', day: 'numeric' }).format(new Date(`${meeting.date}T12:00:00`))
  return `${date} · ${meeting.startTime} – ${meeting.endTime}`
}

function statusLabel(status: MeetingStatus): string {
  return status.charAt(0).toUpperCase() + status.slice(1)
}

export default function MeetingDetail({ meeting, onClose, onStatusChange, onEdit, onSaveNotes, onUseAgenda, onGenerateSummary, onToggleAction, onCreateTask, onCreateAllTasks, onAIAction }: MeetingDetailProps) {
  const navigate = useNavigate()
  const [preparationOpen, setPreparationOpen] = useState(true)
  const [minutesOpen, setMinutesOpen] = useState(false)
  const pendingActionCount = meeting.summary?.actionItems.filter((item) => item.status !== 'completed' && !item.taskCreated).length ?? 0

  return <div className="meeting-dialog-layer">
    <button type="button" className="meeting-dialog-backdrop" aria-label="Close meeting details" onClick={onClose} />
    <aside className="meeting-detail-drawer" role="dialog" aria-modal="true" aria-labelledby="meeting-detail-title">
      <header className="meeting-detail-header"><div><span className="meetings-eyebrow">MEETING DETAILS</span><p>{meeting.department}</p></div><button type="button" className="meeting-icon-button" aria-label="Close meeting details" onClick={onClose}><MeetingIcon name="close" /></button></header>
      <div className="meeting-detail-scroll">
        <div className="meeting-detail-title-row"><span className="meeting-detail-type-icon"><MeetingIcon name={meeting.type === 'virtual' ? 'video' : 'calendar'} size={18} /></span><div><h2 id="meeting-detail-title">{meeting.title}</h2><p>{dateTime(meeting)}</p></div></div>
        <div className="meeting-detail-badges"><span className={`meeting-detail-status status-${meeting.status}`}>{statusLabel(meeting.status)}</span><span className={`meeting-prep-badge prep-${meeting.preparationStatus}`}>{meeting.preparationStatus.replace('-', ' ')}</span><span className="meeting-detail-type-label">{meeting.type}</span></div>
        <div className="meeting-detail-actions"><button type="button" className="meetings-primary-button" onClick={() => onStatusChange(meeting, meeting.status === 'draft' ? 'upcoming' : meeting.status === 'ongoing' ? 'completed' : meeting.status === 'completed' ? 'upcoming' : 'ongoing')}><MeetingIcon name={meeting.status === 'ongoing' || meeting.status === 'completed' ? 'check' : meeting.status === 'draft' ? 'calendar' : 'play'} size={14} />{meeting.status === 'draft' ? 'Schedule Meeting' : meeting.status === 'ongoing' ? 'End Meeting' : meeting.status === 'completed' ? 'Reopen' : 'Start Meeting'}</button><button type="button" className="meeting-secondary-button" onClick={() => setPreparationOpen((value) => !value)}><MeetingIcon name="sparkles" size={14} />Prepare with AI</button><button type="button" className="meeting-icon-button" aria-label="Edit meeting" onClick={() => onEdit(meeting)}><MeetingIcon name="edit" size={15} /></button><button type="button" className="meeting-icon-button meeting-cancel-button" aria-label="Cancel meeting" onClick={() => onStatusChange(meeting, 'cancelled')}><MeetingIcon name="x" size={16} /></button></div>

        <section className="meeting-detail-section"><h3>Meeting information</h3><dl className="meeting-detail-properties"><div><dt>Location</dt><dd><MeetingIcon name={meeting.type === 'virtual' ? 'video' : 'location'} size={14} />{meeting.location}</dd></div><div><dt>Organizer</dt><dd><MeetingIcon name="building" size={14} />{meeting.organizer}</dd></div><div><dt>Participants</dt><dd><MeetingIcon name="users" size={14} />{meeting.participants.length} participants</dd></div><div><dt>Department</dt><dd>{meeting.department}</dd></div></dl><div className="meeting-participant-list">{meeting.participants.slice(0, 8).map((participant) => <span key={participant.id} title={participant.name}>{participant.name.split(' ').map((part) => part[0]).join('').slice(0, 2)}</span>)}{meeting.participants.length > 8 && <small>+{meeting.participants.length - 8}</small>}</div></section>

        {preparationOpen && <section className="meeting-detail-section meeting-detail-preparation"><div className="meeting-detail-section-heading"><div><h3>Prepare with OfficePilot</h3><p>Useful context for a more focused discussion.</p></div><span className="meeting-ai-demo-label">DEMO</span></div><div className="meeting-objective"><span>MEETING OBJECTIVE</span><p>Review departmental progress, resolve outstanding requests, and assign responsibilities for the next reporting period.</p></div><div className="meeting-prep-detail-grid"><div><strong>Open issues</strong><span>3 outstanding tasks</span><span>2 unanswered correspondence items</span><span>1 overdue action</span></div><div><strong>Questions to consider</strong><span>What is delaying the pending report?</span><span>Who owns the outstanding action?</span></div></div><div className="meeting-detail-ai-actions"><button type="button" onClick={() => onGenerateSummary(meeting)}><MeetingIcon name="sparkles" size={14} />Summarize meeting</button><button type="button" onClick={() => onAIAction(meeting, 'decisions')}>Extract decisions</button><button type="button" onClick={() => onAIAction(meeting, 'actions')}>Extract action items</button><button type="button" onClick={() => onAIAction(meeting, 'follow-up')}>Draft follow-up email</button><button type="button" onClick={() => setMinutesOpen(true)}><MeetingIcon name="minute" size={14} />Generate Minutes</button></div><button type="button" className="meeting-use-agenda" onClick={() => onUseAgenda(meeting, ['Review outstanding actions', 'Discuss pending correspondence', 'Review Q3 progress', 'Assign next steps'])}>Use suggested agenda <MeetingIcon name="arrow" size={14} /></button></section>}

        <section className="meeting-detail-section"><div className="meeting-detail-section-heading"><h3>Agenda</h3><span>{meeting.agenda.length} items</span></div>{meeting.agenda.length ? <ol className="meeting-agenda-list">{meeting.agenda.map((item, index) => <li key={`${index}-${item}`}><span>{String(index + 1).padStart(2, '0')}</span>{item}</li>)}</ol> : <p className="meeting-detail-empty-copy">No agenda has been added yet.</p>}</section>

        <section className="meeting-detail-section"><h3>Related documents</h3>{meeting.relatedDocuments.length ? <div className="meeting-related-list">{meeting.relatedDocuments.map((file) => <button type="button" key={file.id} onClick={() => navigate('/documents', { state: { documentName: file.name } })}><span className="meeting-related-icon"><MeetingIcon name="file" size={15} /></span><span><strong>{file.name}</strong><small>{file.type} · Workspace document</small></span><MeetingIcon name="external" size={14} /></button>)}</div> : <p className="meeting-detail-empty-copy">No related documents.</p>}</section>

        <section className="meeting-detail-section"><h3>Related correspondence</h3>{meeting.relatedCorrespondence.length ? <div className="meeting-related-list">{meeting.relatedCorrespondence.map((subject) => <button type="button" key={subject} onClick={() => navigate('/correspondence')}><span className="meeting-related-icon"><MeetingIcon name="mail" size={15} /></span><span><strong>{subject}</strong><small>Correspondence</small></span><MeetingIcon name="external" size={14} /></button>)}</div> : <p className="meeting-detail-empty-copy">No related correspondence.</p>}</section>

        <section className="meeting-detail-section"><h3>Related tasks</h3>{meeting.relatedTasks.length ? <div className="meeting-related-list">{meeting.relatedTasks.map((task) => <button type="button" key={task} onClick={() => navigate('/tasks', { state: { taskTitle: task } })}><span className="meeting-related-icon"><MeetingIcon name="task" size={15} /></span><span><strong>{task}</strong><small>Meeting follow-up</small></span><MeetingIcon name="external" size={14} /></button>)}</div> : <p className="meeting-detail-empty-copy">No related tasks.</p>}</section>

        <MeetingNotesPanel notes={meeting.notes} onSave={(notes) => onSaveNotes(meeting, notes)} onSummarize={() => onGenerateSummary(meeting)} />

        {meeting.summary && <section className="meeting-detail-section meeting-summary-panel"><div className="meeting-detail-section-heading"><div><h3>Meeting summary</h3><span className="meeting-ai-demo-label">OFFICEPILOT DEMO</span></div><div className="meeting-summary-header-actions"><button type="button" className="meeting-text-action" onClick={() => onAIAction(meeting, 'copy-summary')}><MeetingIcon name="copy" size={13} />Copy</button></div></div><p className="meeting-summary-overview">{meeting.summary.overview}</p><h4>Key decisions</h4><ul className="meeting-decision-list">{meeting.summary.keyDecisions.map((decision) => <li key={decision}>{decision}</li>)}</ul><MeetingActionItems items={meeting.summary.actionItems} onCreateTask={(item) => onCreateTask(meeting, item)} onToggleComplete={(item) => onToggleAction(meeting, item)} onCreateAll={() => onCreateAllTasks(meeting)} />{pendingActionCount === 0 && <span className="meeting-all-tasks-created"><MeetingIcon name="check" size={14} />All action items have tasks.</span>}</section>}

        {!meeting.summary && <section className="meeting-detail-section"><div className="meeting-detail-section-heading"><div><h3>Meeting summary</h3><p>Generate a concise record from notes and decisions.</p></div></div><button type="button" className="meeting-summary-generate" onClick={() => onGenerateSummary(meeting)}><MeetingIcon name="sparkles" size={15} />Summarize with AI</button></section>}

        <section className="meeting-detail-section"><div className="meeting-detail-section-heading"><h3>Activity</h3><span>{meeting.activity.length}</span></div><ol className="meeting-activity-list">{meeting.activity.map((event) => <li key={event.id}><span className="meeting-activity-marker" /><div><p>{event.description}</p><time>{event.dateLabel} · {event.time}</time></div></li>)}</ol></section>
        <footer className="meeting-detail-footer"><button type="button" className="meeting-secondary-button" onClick={() => onStatusChange(meeting, 'cancelled')}>Cancel meeting</button><span>Changes are saved in this demo workspace.</span></footer>
      </div>
      {minutesOpen && <MeetingMinutesModal meeting={meeting} onClose={() => setMinutesOpen(false)} />}
    </aside>
  </div>
}