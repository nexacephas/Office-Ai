import { useEffect, useState } from 'react'
import type { Meeting } from '../meetingTypes'
import MeetingIcon from './MeetingIcon'
import './MeetingAIModal.css'

export type MeetingAIMode = 'prepare' | 'prepare-new' | 'summary' | 'decisions' | 'actions' | 'follow-up'

interface MeetingAIModalProps {
  meeting?: Meeting
  mode: MeetingAIMode
  prompt?: string
  onClose: () => void
  onUseAgenda: (agenda: string[]) => void
  onCreateTasks?: (meeting: Meeting) => void
}

const suggestedAgenda = ['Review outstanding actions', 'Discuss pending correspondence', 'Review Q3 progress', 'Assign next steps']

function titleFor(mode: MeetingAIMode): string {
  if (mode === 'prepare' || mode === 'prepare-new') return 'Prepare me for this meeting'
  if (mode === 'summary') return 'Meeting summary'
  if (mode === 'decisions') return 'Key decisions'
  if (mode === 'actions') return 'Action items'
  return 'Draft a follow-up'
}

function responseFor(meeting: Meeting | undefined, mode: MeetingAIMode, prompt: string): string {
  if (mode === 'prepare-new') return `OfficePilot will help structure a focused meeting around: ${prompt || meeting?.title || 'your meeting topic'}.\n\nSuggested agenda:\n${suggestedAgenda.map((item, index) => `${index + 1}. ${item}`).join('\n')}`
  if (!meeting) return `Use this demo preparation checklist to start: ${suggestedAgenda.map((item, index) => `${index + 1}. ${item}`).join('\n')}`
  if (mode === 'prepare') return `Objective\nReview departmental progress, resolve outstanding requests, and assign responsibilities for the next reporting period.\n\nKey context\n${meeting.description}\n\nOpen issues\n• 3 outstanding tasks\n• 2 unanswered correspondence items\n• 1 overdue action\n\nSuggested agenda\n${suggestedAgenda.map((item, index) => `${index + 1}. ${item}`).join('\n')}`
  if (mode === 'summary') return meeting.summary?.overview ?? `${meeting.title} covered ${meeting.description.toLowerCase()} The team should capture decisions, assign owners, and agree on the next review date.`
  if (mode === 'decisions') return meeting.summary?.keyDecisions.map((decision) => `• ${decision}`).join('\n') ?? '• Confirm the meeting owner for each open item.\n• Review outstanding correspondence before the next meeting.\n• Share an update with relevant department leads.'
  if (mode === 'actions') return meeting.summary?.actionItems.map((item) => `• ${item.title} — ${item.owner}, due ${item.dueDate}`).join('\n') ?? '• Submit the outstanding department update.\n• Review pending correspondence.\n• Confirm the next follow-up date.'
  return `Subject: Follow-up: ${meeting.title}\n\nThank you for joining ${meeting.title}. We have recorded the key decisions and follow-up actions. Please review the assigned items and share any updates before the next meeting.\n\nKind regards,\nTransport Planning & Coordination`
}

export default function MeetingAIModal({ meeting, mode, prompt = '', onClose, onUseAgenda, onCreateTasks }: MeetingAIModalProps) {
  const [loading, setLoading] = useState(true)
  const [output, setOutput] = useState('')

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setOutput(responseFor(meeting, mode, prompt))
      setLoading(false)
    }, 450)
    return () => window.clearTimeout(timeout)
  }, [meeting, mode, prompt])

  const agendaMode = mode === 'prepare' || mode === 'prepare-new'
  return <div className="meeting-dialog-layer meeting-ai-modal-layer"><button type="button" className="meeting-dialog-backdrop" aria-label="Close OfficePilot meeting assistant" onClick={onClose} /><section className="meeting-ai-modal" role="dialog" aria-modal="true" aria-labelledby="meeting-ai-title"><header><span className="meeting-ai-modal-icon"><MeetingIcon name="sparkles" size={18} /></span><div><span className="meetings-eyebrow">OFFICEPILOT AI · DEMO</span><h2 id="meeting-ai-title">{titleFor(mode)}</h2>{meeting && <p>{meeting.title}</p>}</div><button type="button" className="meeting-icon-button" aria-label="Close OfficePilot meeting assistant" onClick={onClose}><MeetingIcon name="close" /></button></header>{loading ? <div className="meeting-ai-loading" role="status"><span className="meeting-spinner" /><strong>Preparing meeting context…</strong><p>Reviewing agenda, notes, documents, and follow-ups.</p></div> : <div className="meeting-ai-output"><span>MOCK MEETING INSIGHT</span><p>{output}</p></div>}<footer><p>Generated from mock meeting data. No AI service was called.</p><div>{meeting && mode === 'actions' && onCreateTasks && <button type="button" className="meeting-secondary-button" onClick={() => onCreateTasks(meeting)}>Create all tasks</button>}{agendaMode && <button type="button" className="meetings-primary-button" disabled={loading} onClick={() => { onUseAgenda(suggestedAgenda); onClose() }}>Use suggested agenda</button>}<button type="button" className="meeting-secondary-button" onClick={onClose}>Done</button></div></footer></section></div>
}