import { useState } from 'react'
import './ApprovalRequest.css'

type Props = {
  onClose: () => void
  onSubmit: (payload: Record<string, string>) => void
}

const defaultValues = {
  title: 'Quarterly Transport Report',
  type: 'Document',
  item: 'Quarterly Transport Report.pdf',
  approver: 'Manager',
  department: 'TPC',
  priority: 'High',
  dueDate: '2026-10-04',
  reason: 'Final sign-off before submission to executive stakeholders.',
  supportingDocuments: 'Briefing note, financial summary, route plan',
}

export default function ApprovalRequest({ onClose, onSubmit }: Props) {
  const [formValues, setFormValues] = useState(defaultValues)

  function updateField(key: keyof typeof defaultValues, value: string) {
    setFormValues((current) => ({ ...current, [key]: value }))
  }

  return (
    <div className="approval-request-shell">
      <div className="approval-request-shell__header">
        <div>
          <span>REQUEST APPROVAL</span>
          <h3>Submit a review request</h3>
        </div>
        <button type="button" className="ghost-button" onClick={onClose}>Close</button>
      </div>

      <div className="approval-request-form">
        <label>
          <span>Approval title</span>
          <input value={formValues.title} onChange={(event) => updateField('title', event.target.value)} />
        </label>
        <label>
          <span>Type</span>
          <select value={formValues.type} onChange={(event) => updateField('type', event.target.value)}>
            <option>Document</option>
            <option>Correspondence</option>
            <option>Meeting</option>
            <option>Task</option>
            <option>AI Draft</option>
          </select>
        </label>
        <label>
          <span>Item</span>
          <input value={formValues.item} onChange={(event) => updateField('item', event.target.value)} />
        </label>
        <label>
          <span>Approver</span>
          <select value={formValues.approver} onChange={(event) => updateField('approver', event.target.value)}>
            <option>Manager</option>
            <option>Director</option>
            <option>Permanent Secretary</option>
          </select>
        </label>
        <label>
          <span>Department</span>
          <select value={formValues.department} onChange={(event) => updateField('department', event.target.value)}>
            <option>TPC</option>
            <option>Transport Planning Unit</option>
            <option>Administrative Department</option>
            <option>HR</option>
            <option>Legal</option>
          </select>
        </label>
        <label>
          <span>Priority</span>
          <select value={formValues.priority} onChange={(event) => updateField('priority', event.target.value)}>
            <option>Urgent</option>
            <option>High</option>
            <option>Normal</option>
            <option>Low</option>
          </select>
        </label>
        <label>
          <span>Due date</span>
          <input type="date" value={formValues.dueDate} onChange={(event) => updateField('dueDate', event.target.value)} />
        </label>
        <label className="full-width">
          <span>Reason</span>
          <textarea rows={4} value={formValues.reason} onChange={(event) => updateField('reason', event.target.value)} />
        </label>
        <label className="full-width">
          <span>Supporting documents</span>
          <textarea rows={3} value={formValues.supportingDocuments} onChange={(event) => updateField('supportingDocuments', event.target.value)} />
        </label>
      </div>

      <div className="approval-request-form__actions">
        <button type="button" className="ghost-button" onClick={onClose}>Cancel</button>
        <button type="button" className="primary-button" onClick={() => onSubmit(formValues)}>
          Submit for Approval
        </button>
      </div>
    </div>
  )
}
