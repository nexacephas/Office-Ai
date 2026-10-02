import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { CorrespondenceAIAction, CorrespondenceItem, CorrespondencePriority, CorrespondenceStatus } from '../correspondenceTypes'
import { correspondenceStatusLabels, formatLongDate } from '../correspondenceUtils'
import CorrespondenceIcon from './CorrespondenceIcon'
import './CorrespondenceDetail.css'

interface CorrespondenceDetailProps {
  item: CorrespondenceItem
  today: string
  onClose: () => void
  onUpdateStatus: (item: CorrespondenceItem, status: CorrespondenceStatus) => void
  onSaveResponse: (item: CorrespondenceItem, response: string, status: CorrespondenceStatus) => void
  responseText: string
  onResponseChange: (response: string) => void
  onDraftAI: (item: CorrespondenceItem) => void
  onAIAction: (item: CorrespondenceItem, action: Exclude<CorrespondenceAIAction, 'task' | 'documents' | 'forward'>) => void
  onCreateTask: (item: CorrespondenceItem, title: string, due: string, priority: CorrespondencePriority) => void
  onForward: (item: CorrespondenceItem, recipient: string) => void
}

function todayString(): string {
  const date = new Date()
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

function isOverdue(item: CorrespondenceItem, today: string): boolean {
  return item.status === 'overdue' || Boolean(item.responseDeadline && item.responseDeadline < today && !['completed', 'sent', 'archived', 'draft'].includes(item.status))
}

function downloadAttachment(item: CorrespondenceItem, fileName: string) {
  const blob = new Blob([`${item.subject}\n${item.message}`], { type: 'text/plain' })
  const url = URL.createObjectURL(blob)
  const link = window.document.createElement('a')
  link.href = url
  link.download = `${fileName.replace(/\.[^.]+$/, '')}.txt`
  link.click()
  URL.revokeObjectURL(url)
}

export default function CorrespondenceDetail({ item, today, onClose, onUpdateStatus, onSaveResponse, responseText, onResponseChange, onDraftAI, onAIAction, onCreateTask, onForward }: CorrespondenceDetailProps) {
  const navigate = useNavigate()
  const [responseOpen, setResponseOpen] = useState(false)
  const [taskOpen, setTaskOpen] = useState(false)
  const [taskTitle, setTaskTitle] = useState(item.relatedTask ?? `Respond to: ${item.subject}`)
  const [taskDue, setTaskDue] = useState(item.responseDeadline ?? todayString())
  const [taskPriority, setTaskPriority] = useState<CorrespondencePriority>(item.priority)
  const [forwardOpen, setForwardOpen] = useState(false)
  const [forwardRecipient, setForwardRecipient] = useState('')
  const [previewFile, setPreviewFile] = useState<string | null>(null)
  const [processingAttachment, setProcessingAttachment] = useState(false)
  const [sending, setSending] = useState(false)
  const status: CorrespondenceStatus = isOverdue(item, today) ? 'overdue' : item.status

  function submitTask(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!taskTitle.trim() || !taskDue) return
    onCreateTask(item, taskTitle.trim(), taskDue, taskPriority)
    setTaskOpen(false)
  }

  function submitForward(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!forwardRecipient.trim()) return
    onForward(item, forwardRecipient.trim())
    setForwardOpen(false)
    setForwardRecipient('')
  }

  function previewAttachment(fileName: string) {
    setPreviewFile(fileName)
    setProcessingAttachment(true)
    window.setTimeout(() => setProcessingAttachment(false), 550)
  }

  function sendResponse() {
    if (!responseText.trim() || sending) return
    setSending(true)
    window.setTimeout(() => {
      onSaveResponse(item, responseText, 'sent')
      setSending(false)
    }, 500)
  }

  return (
    <div className="correspondence-dialog-layer">
      <button type="button" className="correspondence-dialog-backdrop" aria-label="Close correspondence details" onClick={onClose} />
      <aside className="correspondence-detail-drawer" role="dialog" aria-modal="true" aria-labelledby="correspondence-detail-title">
        <header className="correspondence-detail-header"><div><span className="correspondence-eyebrow">CORRESPONDENCE RECORD</span><p>{item.referenceNumber}</p></div><button type="button" className="correspondence-icon-button" aria-label="Close correspondence details" onClick={onClose}><CorrespondenceIcon name="close" /></button></header>
        <div className="correspondence-detail-scroll">
          <div className="correspondence-detail-title-row"><span className={`correspondence-type-icon type-${item.type}`}><CorrespondenceIcon name={item.type === 'incoming' ? 'inbox' : 'send'} size={17} /></span><div><h2 id="correspondence-detail-title">{item.subject}</h2><div className="correspondence-detail-badges"><span className={`correspondence-type-tag type-${item.type}`}>{item.type === 'incoming' ? 'Incoming' : 'Outgoing'}</span><span className={`correspondence-status status-${status}`}>{correspondenceStatusLabels[status]}</span></div></div></div>
          <div className="correspondence-detail-actions"><button type="button" className="correspondence-primary-button" onClick={() => { setResponseOpen(true); setTaskOpen(false) }}><CorrespondenceIcon name="reply" size={16} />Reply</button><button type="button" className="correspondence-secondary-button" onClick={() => onDraftAI(item)}><CorrespondenceIcon name="sparkles" size={16} />Draft with AI</button><button type="button" className="correspondence-secondary-button" onClick={() => setTaskOpen((open) => !open)}><CorrespondenceIcon name="task" size={15} />Create Task</button><button type="button" className="correspondence-icon-button" aria-label="Forward correspondence" onClick={() => setForwardOpen(true)}><CorrespondenceIcon name="forward" size={17} /></button><button type="button" className="correspondence-icon-button" aria-label="Archive correspondence" onClick={() => onUpdateStatus(item, 'archived')}><CorrespondenceIcon name="archive" size={17} /></button></div>

          {taskOpen && <form className="correspondence-inline-form" onSubmit={submitTask}><div className="correspondence-inline-form-heading"><h3>Create related task</h3><button type="button" aria-label="Close task form" onClick={() => setTaskOpen(false)}><CorrespondenceIcon name="close" size={15} /></button></div><label><span>Task</span><input value={taskTitle} onChange={(event) => setTaskTitle(event.target.value)} required /></label><div className="correspondence-inline-form-grid"><label><span>Due</span><input type="date" value={taskDue} onChange={(event) => setTaskDue(event.target.value)} required /></label><label><span>Priority</span><select value={taskPriority} onChange={(event) => setTaskPriority(event.target.value as CorrespondencePriority)}><option value="low">Low</option><option value="normal">Normal</option><option value="high">High</option><option value="urgent">Urgent</option></select></label></div><button type="submit" className="correspondence-primary-button">Create related task</button></form>}

          {forwardOpen && <form className="correspondence-inline-form" onSubmit={submitForward}><div className="correspondence-inline-form-heading"><h3>Forward correspondence</h3><button type="button" aria-label="Close forward form" onClick={() => setForwardOpen(false)}><CorrespondenceIcon name="close" size={15} /></button></div><label><span>Department or recipient</span><input autoFocus value={forwardRecipient} onChange={(event) => setForwardRecipient(event.target.value)} placeholder="Enter a recipient" required /></label><button type="submit" className="correspondence-primary-button">Forward</button></form>}

          <section className="correspondence-detail-section"><h3>Correspondence information</h3><dl className="correspondence-detail-properties"><div><dt>Reference</dt><dd>{item.referenceNumber}</dd></div><div><dt>From</dt><dd>{item.sender}</dd></div><div><dt>To</dt><dd>{item.recipient}</dd></div><div><dt>Department</dt><dd>{item.department}</dd></div><div><dt>{item.type === 'incoming' ? 'Received' : 'Date'}</dt><dd>{formatLongDate(item.date)}</dd></div>{item.responseDeadline && <div><dt>Response deadline</dt><dd className={isOverdue(item, today) ? 'is-overdue' : ''}>{formatLongDate(item.responseDeadline)}</dd></div>}<div><dt>Priority</dt><dd><span className={`correspondence-priority priority-${item.priority}`}><i />{item.priority}</span></dd></div></dl></section>

          <section className="correspondence-detail-section"><h3>Message</h3><p className="correspondence-detail-message">{item.message}</p>{item.notes && <p className="correspondence-detail-note"><strong>Internal note</strong>{item.notes}</p>}</section>

          {item.attachments.length > 0 && <section className="correspondence-detail-section"><div className="correspondence-detail-section-heading"><h3>Attachments</h3><span>{item.attachments.length}</span></div><div className="correspondence-file-list">{item.attachments.map((file) => <article className="correspondence-file-card" key={file.id}><span className={`correspondence-file-type type-${file.type.toLowerCase()}`}><CorrespondenceIcon name="file" size={17} /></span><div><strong>{file.name}</strong><small>{file.type} · {file.size}</small></div><button type="button" className="correspondence-icon-button" aria-label={`Preview ${file.name}`} onClick={() => previewAttachment(file.name)}><CorrespondenceIcon name="info" size={15} /></button><button type="button" className="correspondence-icon-button" aria-label={`Download ${file.name}`} onClick={() => downloadAttachment(item, file.name)}><CorrespondenceIcon name="download" size={15} /></button></article>)}</div></section>}

          {item.relatedDocuments.length > 0 && <section className="correspondence-detail-section"><h3>Related documents</h3><div className="correspondence-related-docs">{item.relatedDocuments.map((file) => <button type="button" key={file.id} onClick={() => navigate('/documents', { state: { documentName: file.name } })}><span><CorrespondenceIcon name="file" size={15} /></span><span><strong>{file.name}</strong><small>{file.type} · {file.size}</small></span><CorrespondenceIcon name="arrow" size={14} /></button>)}</div></section>}

          {item.relatedTask && <section className="correspondence-detail-section"><h3>Related work</h3><button type="button" className="correspondence-related-task" onClick={() => navigate('/tasks', { state: { taskTitle: item.relatedTask } })}><span className="correspondence-related-task-icon"><CorrespondenceIcon name="task" size={16} /></span><span><strong>{item.relatedTask}</strong><small>Related task · due {item.responseDeadline ? formatLongDate(item.responseDeadline) : 'date not set'}</small></span><CorrespondenceIcon name="arrow" size={14} /></button></section>}

          <section className="correspondence-detail-section"><h3>OfficePilot actions</h3><div className="correspondence-ai-action-grid"><button type="button" onClick={() => onAIAction(item, 'summarize')}><CorrespondenceIcon name="sparkles" size={15} />Summarize</button><button type="button" onClick={() => onDraftAI(item)}><CorrespondenceIcon name="reply" size={15} />Draft response</button><button type="button" onClick={() => onAIAction(item, 'extract')}><CorrespondenceIcon name="list" size={15} />Extract key information</button><button type="button" onClick={() => onAIAction(item, 'deadlines')}><CorrespondenceIcon name="calendar" size={15} />Extract deadlines</button><button type="button" onClick={() => setTaskOpen(true)}><CorrespondenceIcon name="task" size={15} />Create task</button><button type="button" onClick={() => navigate('/documents', { state: { correspondenceId: item.id } })}><CorrespondenceIcon name="folder" size={15} />Find documents</button><button type="button" onClick={() => onAIAction(item, 'explain')}><CorrespondenceIcon name="info" size={15} />Explain correspondence</button></div></section>

          <section className="correspondence-detail-section"><div className="correspondence-detail-section-heading"><h3>Activity</h3><span>{item.activity.length}</span></div><ol className="correspondence-timeline">{item.activity.map((event) => <li key={event.id}><span className="correspondence-timeline-marker" /><div><p>{event.description}</p><time>{event.dateLabel} · {event.time}</time></div></li>)}</ol></section>

          <section className="correspondence-detail-section correspondence-response-section"><div className="correspondence-detail-section-heading"><div><h3>Response</h3><p>Keep the reply connected to this record.</p></div>{!responseOpen && <button type="button" className="correspondence-text-action" onClick={() => { setResponseOpen(true); setTaskOpen(false) }}>Draft response</button>}</div>{responseOpen && <div className="correspondence-response-composer"><label htmlFor="correspondence-response-text">Response to: {item.subject}</label><textarea id="correspondence-response-text" rows={6} value={responseText} onChange={(event) => onResponseChange(event.target.value)} placeholder="Write a formal response..." /><div className="correspondence-response-actions"><button type="button" className="correspondence-secondary-button" onClick={() => onDraftAI(item)}><CorrespondenceIcon name="sparkles" size={14} />Draft with AI</button><span /><button type="button" className="correspondence-secondary-button" disabled={sending} onClick={() => onSaveResponse(item, responseText, 'response-drafted')}>Save Draft</button><button type="button" className="correspondence-secondary-button" disabled={sending} onClick={() => onSaveResponse(item, responseText, 'response-drafted')}>Mark as Ready</button><button type="button" className="correspondence-primary-button" disabled={!responseText.trim() || sending} onClick={sendResponse}>{sending ? <><span className="correspondence-spinner small" />Sending…</> : <><CorrespondenceIcon name="send" size={14} />Send</>}</button></div></div>}</section>
        </div>
      </aside>

      {previewFile && <div className="correspondence-attachment-preview-layer"><button type="button" aria-label="Close attachment preview" onClick={() => setPreviewFile(null)} /><section role="dialog" aria-modal="true" aria-labelledby="correspondence-attachment-preview-title"><header><div><span className="correspondence-eyebrow">ATTACHMENT PREVIEW</span><h2 id="correspondence-attachment-preview-title">{previewFile}</h2></div><button type="button" className="correspondence-icon-button" aria-label="Close attachment preview" onClick={() => setPreviewFile(null)}><CorrespondenceIcon name="close" /></button></header>{processingAttachment ? <div className="correspondence-attachment-processing" role="status"><span className="correspondence-spinner" /><strong>Processing attachment preview</strong><p>Preparing a readable preview in this demo.</p></div> : <div className="correspondence-attachment-paper"><CorrespondenceIcon name="file" size={28} /><strong>{previewFile}</strong><p>Preview available in this demo workspace.</p><p>{item.message}</p></div>}</section></div>}
    </div>
  )
}