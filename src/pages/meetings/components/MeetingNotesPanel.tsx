import { useState } from 'react'
import type { MeetingNotes } from '../meetingTypes'
import MeetingIcon from './MeetingIcon'
import './MeetingNotesPanel.css'

interface MeetingNotesPanelProps {
  notes: MeetingNotes
  onSave: (notes: MeetingNotes) => void
  onSummarize: () => void
}

const noteFields: Array<[keyof MeetingNotes, string, string]> = [
  ['keyDiscussion', 'Key discussion', 'Topics covered and important context'],
  ['decisions', 'Decisions', 'What the group agreed'],
  ['actionItems', 'Action items', 'Owners and next steps'],
  ['questions', 'Questions', 'Open questions to resolve'],
  ['followUp', 'Follow-up', 'What should happen before the next meeting'],
]

export default function MeetingNotesPanel({ notes, onSave, onSummarize }: MeetingNotesPanelProps) {
  const [draftNotes, setDraftNotes] = useState(notes)
  const [saved, setSaved] = useState(false)
  return <section className="meeting-notes-panel"><div className="meeting-detail-section-heading"><div><h3>Meeting Notes</h3><p>Capture the discussion while it is fresh.</p></div><button type="button" className="meeting-notes-add" onClick={() => document.getElementById('meeting-note-keyDiscussion')?.focus()}><MeetingIcon name="plus" size={14} />Add note</button></div><div className="meeting-notes-fields">{noteFields.map(([key, label, placeholder]) => <label key={key}><span>{label}</span><textarea id={`meeting-note-${key}`} rows={key === 'keyDiscussion' ? 3 : 2} value={draftNotes[key]} onChange={(event) => { setDraftNotes({ ...draftNotes, [key]: event.target.value }); setSaved(false) }} placeholder={placeholder} /></label>)}</div><footer><span role="status">{saved ? 'Notes saved in this demo.' : 'Notes are only saved in this browser session.'}</span><div><button type="button" className="meeting-secondary-button" onClick={onSummarize}><MeetingIcon name="sparkles" size={14} />Summarize with AI</button><button type="button" className="meetings-primary-button" onClick={() => { onSave(draftNotes); setSaved(true) }}>Save Notes</button></div></footer></section>
}