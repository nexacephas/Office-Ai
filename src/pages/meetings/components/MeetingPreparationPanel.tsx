import { useNavigate } from 'react-router-dom'
import type { Meeting } from '../meetingTypes'
import MeetingIcon from './MeetingIcon'
import './MeetingPreparationPanel.css'

interface MeetingPreparationPanelProps {
  meeting?: Meeting
  onUseAgenda: (meeting: Meeting) => void
  onOpenMeeting: (meeting: Meeting) => void
}

const suggestedAgenda = ['Review outstanding actions', 'Discuss pending correspondence', 'Review Q3 progress', 'Assign next steps']

export default function MeetingPreparationPanel({ meeting, onUseAgenda, onOpenMeeting }: MeetingPreparationPanelProps) {
  const navigate = useNavigate()
  const target = meeting
  return <section className="meeting-preparation-panel" aria-labelledby="meeting-preparation-heading"><div className="meeting-preparation-heading"><span className="meeting-preparation-icon"><MeetingIcon name="sparkles" size={17} /></span><div><span className="meetings-eyebrow">OFFICEPILOT AI</span><h2 id="meeting-preparation-heading">Prepare me for this meeting</h2></div></div>{target ? <><p className="meeting-prep-context">{target.title}</p><section><h3>Meeting objective</h3><p>Review departmental progress, resolve outstanding requests, and assign responsibilities for the next reporting period.</p></section><section><h3>Key documents</h3><ul className="meeting-prep-document-list">{(target.relatedDocuments.length ? target.relatedDocuments.slice(0, 3).map((file) => file.name) : ['Q3 Department Report', 'Previous Meeting Minutes', 'Pending Correspondence']).map((file) => <li key={file}><MeetingIcon name="file" size={14} /><span>{file}</span></li>)}</ul></section><section><h3>Open issues</h3><div className="meeting-open-issues"><span><b>3</b> outstanding tasks</span><span><b>2</b> unanswered correspondence items</span><span><b>1</b> overdue action</span></div></section><section><h3>Suggested agenda</h3><ol className="meeting-suggested-agenda">{suggestedAgenda.map((item) => <li key={item}>{item}</li>)}</ol></section><section><h3>Questions to consider</h3><ul className="meeting-prep-questions"><li>What is delaying the pending report?</li><li>Who owns the outstanding action?</li><li>What needs to be completed before the next review?</li></ul></section><div className="meeting-prep-actions"><button type="button" className="meetings-primary-button" onClick={() => onUseAgenda(target)}>Use suggested agenda</button><div><button type="button" onClick={() => navigate('/documents')}>Open documents <MeetingIcon name="arrow" size={13} /></button><button type="button" onClick={() => navigate('/tasks')}>View tasks <MeetingIcon name="arrow" size={13} /></button></div><button type="button" className="meeting-prep-open" onClick={() => onOpenMeeting(target)}>Open meeting details</button></div></> : <div className="meeting-prep-empty"><p>Select a meeting to see its objective, documents, open issues, and suggested discussion points.</p><button type="button" onClick={() => navigate('/ai')}>Ask OfficePilot <MeetingIcon name="arrow" size={14} /></button></div>}</section>
}