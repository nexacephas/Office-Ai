import type { FormEvent } from 'react'
import './FileMovementForm.css'

type Props = {
  files: Array<{ fileNumber: string; currentLocation: string; currentHolder: string }>
  onClose: () => void
  onSubmit: (event: FormEvent<HTMLFormElement>) => void
  defaultState: Record<string, string>
  error?: string | null
}

export default function FileMovementForm({ files, onClose, onSubmit, defaultState, error }: Props) {
  return (
    <div className="registry-form-shell">
      <div className="registry-form-header">
        <div>
          <span>RECORD FILE MOVEMENT</span>
          <h3>Movement Log</h3>
        </div>
        <button type="button" className="ghost-button" onClick={onClose}>Close</button>
      </div>

      <form className="registry-form" onSubmit={onSubmit}>
        <div className="form-grid">
          <label className="full-width">
            <span>File</span>
            <select name="file" defaultValue={defaultState.file}>
              {files.map((file) => (
                <option key={file.fileNumber} value={file.fileNumber}>{file.fileNumber}</option>
              ))}
            </select>
          </label>
          <label><span>Current Location / Holder</span><input name="currentLocation" defaultValue={defaultState.currentLocation} /></label>
          <label><span>New Location / Holder</span><input name="newLocation" defaultValue={defaultState.newLocation} /></label>
          <label><span>Movement Type</span><select name="movementType" defaultValue={defaultState.movementType}><option value="Received">Received</option><option value="Dispatched">Dispatched</option><option value="Transferred">Transferred</option><option value="Returned">Returned</option><option value="Retrieved">Retrieved</option><option value="Forwarded">Forwarded</option></select></label>
          <label><span>Date &amp; Time</span><input type="datetime-local" name="dateTime" defaultValue={defaultState.dateTime} /></label>
          <label><span>Expected Return Date</span><input type="date" name="expectedReturnDate" defaultValue={defaultState.expectedReturnDate} /></label>
          <label className="full-width"><span>Reason / Remarks</span><textarea rows={4} name="reason" defaultValue={defaultState.reason} /></label>
        </div>

        {error ? <div className="form-error">{error}</div> : null}

        <div className="form-actions">
          <button type="button" className="ghost-button" onClick={onClose}>Cancel</button>
          <button type="submit" className="primary-button">Record Movement</button>
        </div>
      </form>
    </div>
  )
}
