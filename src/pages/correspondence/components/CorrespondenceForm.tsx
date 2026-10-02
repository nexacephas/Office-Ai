import { useState } from 'react'
import type { FormEvent } from 'react'
import type { CorrespondenceFormValues, CorrespondenceItem, CorrespondenceStatus } from '../correspondenceTypes'
import CorrespondenceIcon from './CorrespondenceIcon'
import './CorrespondenceForm.css'

interface CorrespondenceFormProps {
  items: CorrespondenceItem[]
  aiDraftText: string
  onClose: () => void
  onSave: (values: CorrespondenceFormValues, status: CorrespondenceStatus, openAfterSave: boolean) => void
  onDraftWithAI: (prompt: string) => void
}

function todayString(): string {
  const date = new Date()
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

export default function CorrespondenceForm({ items, aiDraftText, onClose, onSave, onDraftWithAI }: CorrespondenceFormProps) {
  const [values, setValues] = useState<CorrespondenceFormValues>(() => ({
    type: 'incoming',
    subject: '',
    referenceNumber: '',
    date: todayString(),
    sender: '',
    recipient: 'Transport Planning & Coordination',
    department: '',
    priority: 'normal',
    responseDeadline: '',
    relatedDocument: '',
    responseTo: '',
    message: '',
    notes: '',
  }))
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const [appliedAIDraft, setAppliedAIDraft] = useState('')
  const messageValue = aiDraftText && aiDraftText !== appliedAIDraft ? aiDraftText : values.message

  function setField<Key extends keyof CorrespondenceFormValues>(key: Key, value: CorrespondenceFormValues[Key]) {
    setValues((current) => ({ ...current, [key]: value }))
    if (error) setError('')
  }

  function save(status: CorrespondenceStatus, openAfterSave: boolean) {
    if (!values.subject.trim()) {
      setError('Add a subject to save this correspondence.')
      return
    }
    if (status !== 'draft' && (!values.date || !values.sender.trim() || !values.recipient.trim() || !values.department.trim())) {
      setError('Add a subject, date, sender, recipient, and department to continue.')
      return
    }
    setSaving(true)
    window.setTimeout(() => onSave({ ...values, subject: values.subject.trim(), message: messageValue.trim(), notes: values.notes.trim() }, status, openAfterSave), 320)
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    save(values.type === 'incoming' ? 'received' : 'draft', true)
  }

  const responseOptions = items.filter((item) => item.type === 'incoming' && !['completed', 'archived'].includes(item.status))

  return <div className="correspondence-dialog-layer correspondence-form-layer"><button type="button" className="correspondence-dialog-backdrop" aria-label="Close new correspondence form" onClick={saving ? undefined : onClose} /><section className="correspondence-form-dialog" role="dialog" aria-modal="true" aria-labelledby="correspondence-form-title"><header className="correspondence-form-header"><div><span className="correspondence-eyebrow">OFFICE COMMUNICATIONS</span><h2 id="correspondence-form-title">New Correspondence</h2><p>Register communication and keep its next action visible.</p></div><button type="button" className="correspondence-icon-button" aria-label="Close new correspondence form" disabled={saving} onClick={onClose}><CorrespondenceIcon name="close" /></button></header>
    <form onSubmit={submit} noValidate>
      <div className="correspondence-form-body">
        <div className="correspondence-form-type"><span>Correspondence type</span><div role="group" aria-label="Correspondence type"><button type="button" className={values.type === 'incoming' ? 'is-active' : ''} aria-pressed={values.type === 'incoming'} onClick={() => { setField('type', 'incoming'); setField('recipient', 'Transport Planning & Coordination') }}><CorrespondenceIcon name="inbox" size={16} />Incoming</button><button type="button" className={values.type === 'outgoing' ? 'is-active' : ''} aria-pressed={values.type === 'outgoing'} onClick={() => { setField('type', 'outgoing'); setField('sender', 'Transport Planning & Coordination') }}><CorrespondenceIcon name="send" size={16} />Outgoing</button></div></div>
        <div className="correspondence-form-grid">
          <label className="correspondence-form-field full"><span>Subject <i>*</i></span><input autoFocus value={values.subject} onChange={(event) => setField('subject', event.target.value)} placeholder="Enter a clear subject" aria-required="true" /></label>
          <label className="correspondence-form-field"><span>Reference number</span><input value={values.referenceNumber} onChange={(event) => setField('referenceNumber', event.target.value)} placeholder="e.g. FMT/TPC/2026/185" /></label>
          <label className="correspondence-form-field"><span>Date <i>*</i></span><input type="date" value={values.date} onChange={(event) => setField('date', event.target.value)} required /></label>
          <label className="correspondence-form-field"><span>{values.type === 'incoming' ? 'Sender' : 'From'} <i>*</i></span><input value={values.sender} onChange={(event) => setField('sender', event.target.value)} placeholder="Department or person" required /></label>
          <label className="correspondence-form-field"><span>{values.type === 'incoming' ? 'Recipient' : 'To'} <i>*</i></span><input value={values.recipient} onChange={(event) => setField('recipient', event.target.value)} placeholder="Department or person" required /></label>
          <label className="correspondence-form-field"><span>Department <i>*</i></span><input value={values.department} onChange={(event) => setField('department', event.target.value)} placeholder="Owning department" required /></label>
          <label className="correspondence-form-field"><span>Priority</span><select value={values.priority} onChange={(event) => setField('priority', event.target.value as CorrespondenceFormValues['priority'])}><option value="low">Low</option><option value="normal">Normal</option><option value="high">High</option><option value="urgent">Urgent</option></select></label>
          <label className="correspondence-form-field"><span>Response deadline</span><input type="date" value={values.responseDeadline} onChange={(event) => setField('responseDeadline', event.target.value)} /></label>
          <label className="correspondence-form-field"><span>Related document</span><input value={values.relatedDocument} onChange={(event) => setField('relatedDocument', event.target.value)} placeholder="Document name or reference" /></label>
          {values.type === 'outgoing' && <label className="correspondence-form-field"><span>Response to</span><select value={values.responseTo} onChange={(event) => setField('responseTo', event.target.value)}><option value="">Select existing correspondence</option>{responseOptions.map((item) => <option key={item.id} value={item.id}>{item.subject}</option>)}</select></label>}
          <label className="correspondence-form-field full"><span>Message</span><textarea rows={4} value={messageValue} onChange={(event) => { setAppliedAIDraft(aiDraftText); setField('message', event.target.value) }} placeholder="Add the correspondence text or a brief summary" /></label>
          <label className="correspondence-form-field full"><span>Notes</span><textarea rows={2} value={values.notes} onChange={(event) => setField('notes', event.target.value)} placeholder="Internal notes or next steps" /></label>
        </div>
        {error && <p className="correspondence-form-error" role="alert">{error}</p>}
        <button type="button" className="correspondence-form-ai-link" onClick={() => onDraftWithAI(values.message || values.subject)}><CorrespondenceIcon name="sparkles" size={16} />Draft with OfficePilot</button>
      </div>
      <footer className="correspondence-form-footer"><span><i>*</i> Required fields</span><div><button type="button" className="correspondence-secondary-button" disabled={saving} onClick={() => save('draft', false)}>{saving ? 'Saving…' : 'Save Draft'}</button><button type="submit" className="correspondence-primary-button" disabled={saving}>{saving ? 'Saving…' : 'Save & Continue'}</button></div></footer>
    </form>
  </section></div>
}