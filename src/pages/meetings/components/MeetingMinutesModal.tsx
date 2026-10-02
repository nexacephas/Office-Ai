import { useState } from 'react'
import type { Meeting } from '../meetingTypes'
import MeetingIcon from './MeetingIcon'
import './MeetingMinutesModal.css'

interface MeetingMinutesModalProps {
  meeting: Meeting
  onClose: () => void
}

export default function MeetingMinutesModal({ meeting, onClose }: MeetingMinutesModalProps) {
  const [editing, setEditing] = useState(false)
  const [copied, setCopied] = useState(false)
  const summary = meeting.summary
  const minutes = `${meeting.title}\n${new Intl.DateTimeFormat('en-US', { month: 'long', day: 'numeric', year: 'numeric' }).format(new Date(`${meeting.date}T12:00:00`))} · ${meeting.startTime} – ${meeting.endTime}\n${meeting.location}\n\nAttendees\n${meeting.participants.map((participant) => participant.name).join(', ')}\n\nAgenda\n${meeting.agenda.map((item, index) => `${index + 1}. ${item}`).join('\n')}\n\nDiscussion\n${meeting.notes.keyDiscussion || summary?.overview || 'Discussion notes have not been added.'}\n\nDecisions\n${meeting.notes.decisions || summary?.keyDecisions.map((decision) => `• ${decision}`).join('\n') || 'No decisions recorded.'}\n\nAction items\n${meeting.notes.actionItems || summary?.actionItems.map((action) => `• ${action.title} — ${action.owner}, due ${action.dueDate}`).join('\n') || 'No action items recorded.'}\n\nNext meeting\nTo be confirmed`
  const [editedMinutes, setEditedMinutes] = useState(minutes)

  async function copyMinutes() {
    try {
      await navigator.clipboard.writeText(editedMinutes)
      setCopied(true)
    } catch {
      setCopied(false)
    }
  }

  function exportText() {
    const url = URL.createObjectURL(new Blob([editedMinutes], { type: 'text/plain' }))
    const link = window.document.createElement('a')
    link.href = url
    link.download = `${meeting.title.toLowerCase().replaceAll(' ', '-')}-minutes.txt`
    link.click()
    URL.revokeObjectURL(url)
  }

  return <div className="meeting-dialog-layer meeting-minutes-layer"><button type="button" className="meeting-dialog-backdrop" aria-label="Close meeting minutes" onClick={onClose} /><section className="meeting-minutes-modal" role="dialog" aria-modal="true" aria-labelledby="meeting-minutes-title"><header><div><span className="meetings-eyebrow">MEETING RECORD · DEMO</span><h2 id="meeting-minutes-title">Meeting minutes</h2></div><button type="button" className="meeting-icon-button" aria-label="Close meeting minutes" onClick={onClose}><MeetingIcon name="close" /></button></header><textarea aria-label="Minutes content" readOnly={!editing} value={editedMinutes} onChange={(event) => setEditedMinutes(event.target.value)} /><footer><p>Generated from meeting notes and agenda. Review before sharing.</p><div><button type="button" className="meeting-secondary-button" onClick={() => setEditing((value) => !value)}><MeetingIcon name="edit" size={14} />{editing ? 'Done' : 'Edit'}</button><button type="button" className="meeting-secondary-button" onClick={copyMinutes}><MeetingIcon name="copy" size={14} />{copied ? 'Copied' : 'Copy'}</button><button type="button" className="meeting-primary-button" onClick={exportText}><MeetingIcon name="download" size={14} />Export</button></div></footer></section></div>
}