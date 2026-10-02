import type { FormEvent } from 'react'
import './RegisterFileForm.css'

type Props = {
  formState: Record<string, string>
  onClose: () => void
  onSubmit: (event: FormEvent<HTMLFormElement>) => void
  error?: string | null
}

export default function RegisterFileForm({ formState, onClose, onSubmit, error }: Props) {
  return (
    <div className="registry-form-shell">
      <div className="registry-form-header">
        <div>
          <span>REGISTER FILE</span>
          <h3>New registry entry</h3>
        </div>
        <button type="button" className="ghost-button" onClick={onClose}>Close</button>
      </div>

      <form className="registry-form" onSubmit={onSubmit}>
        <div className="form-grid">
          <label><span>File Number</span><input name="fileNumber" defaultValue={formState.fileNumber} required /></label>
          <label><span>Subject</span><input name="subject" defaultValue={formState.subject} required /></label>
          <label><span>File Type</span><select name="fileType" defaultValue={formState.fileType}><option value="Report">Report</option><option value="Memo">Memo</option><option value="Letter">Letter</option><option value="Contract">Contract</option><option value="Petition">Petition</option></select></label>
          <label><span>Direction</span><select name="direction" defaultValue={formState.direction}><option value="Incoming">Incoming</option><option value="Outgoing">Outgoing</option></select></label>
          <label><span>Reference Number</span><input name="referenceNumber" defaultValue={formState.referenceNumber} /></label>
          <label><span>Originating Department</span><input name="originDepartment" defaultValue={formState.originDepartment} /></label>
          <label><span>Destination Department</span><input name="destinationDepartment" defaultValue={formState.destinationDepartment} /></label>
          <label><span>Sender / Originator</span><input name="sender" defaultValue={formState.sender} /></label>
          <label><span>Recipient</span><input name="recipient" defaultValue={formState.recipient} /></label>
          <label><span>Date Received</span><input type="date" name="dateReceived" defaultValue={formState.dateReceived} /></label>
          <label><span>Date Registered</span><input type="date" name="dateRegistered" defaultValue={formState.dateRegistered} /></label>
          <label><span>Priority</span><select name="priority" defaultValue={formState.priority}><option value="Low">Low</option><option value="Normal">Normal</option><option value="High">High</option><option value="Urgent">Urgent</option></select></label>
          <label><span>Current Holder</span><input name="currentHolder" defaultValue={formState.currentHolder} /></label>
          <label className="full-width"><span>Description</span><textarea rows={4} name="description" defaultValue={formState.description} /></label>
          <label className="full-width"><span>Related Document</span><input name="relatedDocument" defaultValue={formState.relatedDocument} /></label>
          <label className="full-width"><span>Related Correspondence</span><input name="relatedCorrespondence" defaultValue={formState.relatedCorrespondence} /></label>
          <label className="full-width"><span>Tags</span><input name="tags" defaultValue={formState.tags} /></label>
        </div>

        {error ? <div className="form-error">{error}</div> : null}

        <div className="form-actions">
          <button type="button" className="ghost-button" onClick={onClose}>Cancel</button>
          <button type="button" className="secondary-button">Save as Draft</button>
          <button type="submit" className="primary-button">Register File</button>
        </div>
      </form>
    </div>
  )
}
