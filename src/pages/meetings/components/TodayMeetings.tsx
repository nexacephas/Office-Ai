import type { Meeting } from '../meetingTypes'
import MeetingIcon from './MeetingIcon'
import MeetingCard from './MeetingCard'
import './TodayMeetings.css'

interface TodayMeetingsProps {
  meetings: Meeting[]
  today: string
  onOpen: (meeting: Meeting) => void
  onPrepare: (meeting: Meeting) => void
  onSchedule: () => void
}

export default function TodayMeetings({ meetings, today, onOpen, onPrepare, onSchedule }: TodayMeetingsProps) {
  const active = meetings.filter((meeting) => meeting.status !== 'completed' && meeting.status !== 'cancelled').sort((first, second) => first.startTime.localeCompare(second.startTime))
  const featured = active.find((meeting) => meeting.preparationStatus === 'needs-preparation') ?? active[0]
  return <section className="today-meetings-section" aria-labelledby="today-meetings-heading"><div className="meetings-section-header"><div><span className="meetings-eyebrow">YOUR DAY</span><h2 id="today-meetings-heading">Today’s meetings</h2><p>{meetings.length ? `${meetings.length} meetings on your schedule` : 'A little room in your calendar today.'}</p></div><span className="today-date-chip"><MeetingIcon name="calendar" size={15} />{new Intl.DateTimeFormat('en-US', { weekday: 'short', month: 'short', day: 'numeric' }).format(new Date(`${today}T12:00:00`))}</span></div>
    {meetings.length ? <div className="today-meeting-list">{meetings.map((meeting) => <MeetingCard key={meeting.id} meeting={meeting} today={today} featured={featured?.id === meeting.id} onOpen={() => onOpen(meeting)} onPrepare={() => onPrepare(meeting)} />)}</div> : <div className="meetings-empty-inline"><span><MeetingIcon name="calendar" size={18} /></span><div><strong>No meetings scheduled</strong><p>Your calendar is clear for today.</p></div><button type="button" className="meeting-secondary-button" onClick={onSchedule}><MeetingIcon name="plus" size={15} />Schedule</button></div>}
  </section>
}