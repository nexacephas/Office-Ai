import type { Meeting } from '../meetingTypes'
import MeetingIcon from './MeetingIcon'

interface MeetingCardProps {
  meeting: Meeting
  today: string
  featured?: boolean
  onOpen: () => void
  onPrepare: () => void
}

function statusCopy(meeting: Meeting, today: string): string {
  if (meeting.status === 'draft') return 'Draft'
  if (meeting.status === 'completed') return 'Completed'
  if (meeting.status === 'ongoing') return 'In progress'
  if (meeting.date === today && meeting.startTime === '09:00 AM') return 'Starting in 25 min'
  return meeting.preparationStatus === 'needs-preparation' ? 'Needs preparation' : 'Upcoming'
}

function prepLabel(status: Meeting['preparationStatus']): string {
  return status === 'needs-preparation' ? 'Needs preparation' : status === 'prepared' ? 'Prepared' : status === 'completed' ? 'Completed' : 'Ready'
}

export default function MeetingCard({ meeting, today, featured = false, onOpen, onPrepare }: MeetingCardProps) {
  const isVirtual = meeting.type === 'virtual'
  return <article className={`meeting-card ${featured ? 'is-featured' : ''} ${meeting.status === 'completed' ? 'is-completed' : ''}`}>
    <div className="meeting-card-time"><span>{meeting.startTime}</span><small>{meeting.endTime}</small></div>
    <div className="meeting-card-main"><div className="meeting-card-title-line"><button type="button" className="meeting-card-title" onClick={onOpen}>{meeting.title}</button>{featured && <span className="meeting-card-live"><i />NEXT</span>}</div><div className="meeting-card-meta"><span><MeetingIcon name={isVirtual ? 'video' : 'location'} size={14} />{meeting.location}</span><span><MeetingIcon name="users" size={14} />{meeting.participants.length} participants</span><span><MeetingIcon name="building" size={13} />{meeting.organizer}</span></div></div>
    <div className="meeting-card-state"><span className={`meeting-prep-badge prep-${meeting.preparationStatus}`}>{prepLabel(meeting.preparationStatus)}</span><span className={`meeting-status-label status-${meeting.status}`}>{statusCopy(meeting, today)}</span></div>
    <div className="meeting-card-actions"><button type="button" className="meeting-secondary-button" onClick={onOpen}>View</button>{meeting.status !== 'completed' && <button type="button" className="meeting-text-action" onClick={onPrepare}>Prepare</button>}</div>
  </article>
}