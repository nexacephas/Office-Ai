import { useState } from 'react'
import type { FormEvent } from 'react'
import type { Meeting, MeetingFormValues, MeetingStatus } from '../meetingTypes'
import MeetingIcon from './MeetingIcon'
import './ScheduleMeetingModal.css'

interface ScheduleMeetingModalProps {
  meeting?: Meeting
  onClose: () => void
  onSave: (values: MeetingFormValues, status: MeetingStatus) => void
  onPrepareAI: (prompt: string) => void
}

function todayString(): string {
  const date = new Date()
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

function timeValue(value: string): string {
  const match = value.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i)
  if (!match) return value
  let hour = Number(match[1]) % 12
  if (match[3].toUpperCase() === 'PM') hour += 12
  return `${String(hour).padStart(2, '0')}:${match[2]}`
}

export default function ScheduleMeetingModal({ meeting, onClose, onSave, onPrepareAI }: ScheduleMeetingModalProps) {
  const [values, setValues] = useState<MeetingFormValues>(() => ({
    title: meeting?.title ?? '',
    date: meeting?.date ?? todayString(),
    startTime: meeting ? timeValue(meeting.startTime) : '09:00',
    endTime: meeting ? timeValue(meeting.endTime) : '10:00',
    location: meeting?.location ?? '',
    type: meeting?.type ?? 'in-person',
    organizer: meeting?.organizer ?? 'Transport Planning & Coordination',
    participants: meeting?.participants.map((participant) => participant.name).join(', ') ?? '',
    department: meeting?.department ?? '',
    description: meeting?.description ?? '',
    agenda: meeting?.agenda.join('\n') ?? '',
    relatedDocuments: meeting?.relatedDocuments.map((file) => file.name).join('\n') ?? '',
    relatedTasks: meeting?.relatedTasks.join('\n') ?? '',
    relatedCorrespondence: meeting?.relatedCorrespondence.join('\n') ?? '',
  }))
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  function setField<Key extends keyof MeetingFormValues>(key: Key, value: MeetingFormValues[Key]) {
    setValues((current) => ({ ...current, [key]: value }))
    if (error) setError('')
  }

  function save(status: MeetingStatus) {
    if (!values.title.trim()) {
      setError('Add a meeting title to continue.')
      return
    }
    if (status !== 'draft' && (!values.date || !values.startTime || !values.endTime || !values.location.trim())) {
      setError('Add a date, start and end time, and location to schedule this meeting.')
      return
    }
    if (status !== 'draft' && values.startTime >= values.endTime) {
      setError('The end time must be later than the start time.')
      return
    }
    setSaving(true)
    window.setTimeout(() => onSave({ ...values, title: values.title.trim() }, status), 300)
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    save('upcoming')
  }

  return <div className="meeting-dialog-layer meeting-schedule-layer"><button type="button" className="meeting-dialog-backdrop" aria-label="Close schedule meeting" onClick={saving ? undefined : onClose} /><section className="meeting-schedule-modal" role="dialog" aria-modal="true" aria-labelledby="meeting-schedule-title"><header className="meeting-schedule-header"><div><span className="meetings-eyebrow">MEETING PLANNER</span><h2 id="meeting-schedule-title">{meeting ? 'Edit meeting' : 'Schedule Meeting'}</h2><p>Set the purpose, people, and next steps in one place.</p></div><button type="button" className="meeting-icon-button" aria-label="Close schedule meeting" disabled={saving} onClick={onClose}><MeetingIcon name="close" /></button></header><form onSubmit={submit} noValidate><div className="meeting-schedule-body"><label className="meeting-form-field full"><span>Meeting title <i>*</i></span><input autoFocus value={values.title} onChange={(event) => setField('title', event.target.value)} placeholder="What is this meeting about?" /></label><div className="meeting-form-type"><span>Meeting type</span><div role="group" aria-label="Meeting type">{(['in-person', 'virtual', 'hybrid'] as const).map((type) => <button type="button" key={type} className={values.type === type ? 'is-active' : ''} aria-pressed={values.type === type} onClick={() => setField('type', type)}>{type === 'in-person' ? 'In-person' : type === 'virtual' ? 'Virtual' : 'Hybrid'}</button>)}</div></div><div className="meeting-form-grid">
        <label className="meeting-form-field"><span>Date <i>*</i></span><input type="date" value={values.date} onChange={(event) => setField('date', event.target.value)} /></label>
        <label className="meeting-form-field"><span>Start time <i>*</i></span><input type="time" value={values.startTime} onChange={(event) => setField('startTime', event.target.value)} /></label>
        <label className="meeting-form-field"><span>End time <i>*</i></span><input type="time" value={values.endTime} onChange={(event) => setField('endTime', event.target.value)} /></label>
        <label className="meeting-form-field"><span>Location <i>*</i></span><input value={values.location} onChange={(event) => setField('location', event.target.value)} placeholder={values.type === 'virtual' ? 'Video meeting link' : 'Room or meeting link'} /></label>
        <label className="meeting-form-field"><span>Organizer</span><input value={values.organizer} onChange={(event) => setField('organizer', event.target.value)} /></label>
        <label className="meeting-form-field"><span>Department</span><input value={values.department} onChange={(event) => setField('department', event.target.value)} placeholder="Department" /></label>
        <label className="meeting-form-field full"><span>Participants</span><input value={values.participants} onChange={(event) => setField('participants', event.target.value)} placeholder="Add names separated by commas" /></label>
        <label className="meeting-form-field full"><span>Description</span><textarea rows={2} value={values.description} onChange={(event) => setField('description', event.target.value)} placeholder="Purpose and context for attendees" /></label>
        <label className="meeting-form-field full"><span>Agenda</span><textarea rows={3} value={values.agenda} onChange={(event) => setField('agenda', event.target.value)} placeholder="One agenda item per line" /></label>
        <label className="meeting-form-field"><span>Related documents</span><textarea rows={2} value={values.relatedDocuments} onChange={(event) => setField('relatedDocuments', event.target.value)} placeholder="Document names, one per line" /></label>
        <label className="meeting-form-field"><span>Related tasks</span><textarea rows={2} value={values.relatedTasks} onChange={(event) => setField('relatedTasks', event.target.value)} placeholder="Task names, one per line" /></label>
        <label className="meeting-form-field full"><span>Related correspondence</span><input value={values.relatedCorrespondence} onChange={(event) => setField('relatedCorrespondence', event.target.value)} placeholder="Subject or reference number" /></label>
      </div>{error && <p className="meeting-form-error" role="alert">{error}</p>}<button type="button" className="meeting-form-ai" onClick={() => onPrepareAI(`Prepare an agenda and context for: ${values.title || 'my upcoming meeting'}`)}><MeetingIcon name="sparkles" size={15} />Prepare with OfficePilot</button></div><footer className="meeting-schedule-footer"><span><i>*</i> Required to schedule</span><div><button type="button" className="meeting-secondary-button" disabled={saving} onClick={() => save('draft')}>{saving ? 'Saving…' : 'Save Draft'}</button><button type="submit" className="meetings-primary-button" disabled={saving}>{saving ? 'Scheduling…' : 'Schedule Meeting'}</button></div></footer></form></section></div>
}