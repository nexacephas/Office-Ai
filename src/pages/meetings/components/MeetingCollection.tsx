import type { Meeting, MeetingView } from '../meetingTypes'
import MeetingIcon from './MeetingIcon'
import MeetingCard from './MeetingCard'
import './MeetingCollection.css'

interface MeetingCollectionProps {
  meetings: Meeting[]
  allMeetings: Meeting[]
  today: string
  view: MeetingView
  onViewChange: (view: MeetingView) => void
  selectedDate: string
  onSelectDate: (date: string) => void
  currentMonth: Date
  onMonthChange: (direction: -1 | 1) => void
  onOpen: (meeting: Meeting) => void
  onPrepare: (meeting: Meeting) => void
}

function dateLabel(date: string, today: string): string {
  if (date === today) return 'TODAY'
  const tomorrow = new Date(`${today}T12:00:00`)
  tomorrow.setDate(tomorrow.getDate() + 1)
  if (date === `${tomorrow.getFullYear()}-${String(tomorrow.getMonth() + 1).padStart(2, '0')}-${String(tomorrow.getDate()).padStart(2, '0')}`) return 'TOMORROW'
  return new Intl.DateTimeFormat('en-US', { weekday: 'long', month: 'short', day: 'numeric' }).format(new Date(`${date}T12:00:00`)).toUpperCase()
}

function monthDays(month: Date): string[] {
  const firstDay = new Date(month.getFullYear(), month.getMonth(), 1)
  const start = new Date(firstDay)
  start.setDate(start.getDate() - start.getDay())
  return Array.from({ length: 42 }, (_, index) => {
    const day = new Date(start)
    day.setDate(start.getDate() + index)
    return `${day.getFullYear()}-${String(day.getMonth() + 1).padStart(2, '0')}-${String(day.getDate()).padStart(2, '0')}`
  })
}

export default function MeetingCollection({ meetings, allMeetings, today, view, onViewChange, selectedDate, onSelectDate, currentMonth, onMonthChange, onOpen, onPrepare }: MeetingCollectionProps) {
  const groups = new Map<string, Meeting[]>()
  meetings.forEach((meeting) => groups.set(meeting.date, [...(groups.get(meeting.date) ?? []), meeting]))
  const dateGrid = monthDays(currentMonth)
  const selectedMeetings = allMeetings.filter((meeting) => meeting.date === selectedDate).sort((a, b) => a.startTime.localeCompare(b.startTime))
  const monthTitle = new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(currentMonth)

  return <section className="meeting-collection" aria-labelledby="upcoming-meetings-heading"><header className="meeting-collection-header"><div><span className="meetings-eyebrow">SCHEDULE</span><h2 id="upcoming-meetings-heading">Upcoming meetings</h2><p>{meetings.length} meetings match your current view.</p></div><div className="meeting-view-toggle" role="group" aria-label="Meeting view"><button type="button" aria-pressed={view === 'list'} className={view === 'list' ? 'is-active' : ''} onClick={() => onViewChange('list')}><MeetingIcon name="list" size={15} />List</button><button type="button" aria-pressed={view === 'calendar'} className={view === 'calendar' ? 'is-active' : ''} onClick={() => onViewChange('calendar')}><MeetingIcon name="grid" size={15} />Calendar</button></div></header>
    {view === 'list' ? meetings.length ? <div className="meeting-group-list">{[...groups.entries()].sort(([first], [second]) => first.localeCompare(second)).map(([date, dateMeetings]) => <section className="meeting-date-group" key={date}><h3><span>{dateLabel(date, today)}</span><i />{dateMeetings.length} {dateMeetings.length === 1 ? 'meeting' : 'meetings'}</h3>{dateMeetings.sort((first, second) => first.startTime.localeCompare(second.startTime)).map((meeting) => <MeetingCard key={meeting.id} meeting={meeting} today={today} onOpen={() => onOpen(meeting)} onPrepare={() => onPrepare(meeting)} />)}</section>)}</div> : <div className="meeting-collection-empty"><span><MeetingIcon name="calendar" size={20} /></span><strong>No upcoming meetings</strong><p>Schedule a meeting to keep the next step on your calendar.</p></div> : <div className="meeting-calendar-layout"><div className="meeting-calendar"><header><button type="button" aria-label="Previous month" className="meeting-icon-button" onClick={() => onMonthChange(-1)}><MeetingIcon name="back" size={16} /></button><strong>{monthTitle}</strong><button type="button" aria-label="Next month" className="meeting-icon-button" onClick={() => onMonthChange(1)}><MeetingIcon name="arrow" size={16} /></button></header><div className="meeting-calendar-grid"><div className="meeting-calendar-weekdays">{['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => <span key={day}>{day}</span>)}</div><div className="meeting-calendar-days">{dateGrid.map((date) => {
      const dayMeetings = allMeetings.filter((meeting) => meeting.date === date)
      const dayNumber = Number(date.slice(-2))
      const inMonth = date.slice(0, 7) === `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}`
      return <button type="button" key={date} className={`meeting-calendar-day ${inMonth ? '' : 'is-outside'} ${date === today ? 'is-today' : ''} ${date === selectedDate ? 'is-selected' : ''}`} aria-pressed={date === selectedDate} onClick={() => onSelectDate(date)}><span>{dayNumber}</span>{dayMeetings.length > 0 && <i aria-label={`${dayMeetings.length} meetings`} />}</button>
    })}</div></div></div><aside className="meeting-calendar-selection"><span className="meetings-eyebrow">SELECTED DATE</span><h3>{dateLabel(selectedDate, today).toLowerCase() === 'today' ? 'Today' : new Intl.DateTimeFormat('en-US', { weekday: 'long', month: 'long', day: 'numeric' }).format(new Date(`${selectedDate}T12:00:00`))}</h3>{selectedMeetings.length ? selectedMeetings.map((meeting) => <button type="button" key={meeting.id} className="meeting-calendar-event" onClick={() => onOpen(meeting)}><time>{meeting.startTime}</time><strong>{meeting.title}</strong><small>{meeting.location}</small></button>) : <p>No meetings on this date.</p>}</aside></div>}
  </section>
}