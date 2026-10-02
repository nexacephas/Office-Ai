import './FileDetail.css'
import FileOverview from '../FileOverview/FileOverview'
import FileMovementTimeline from '../FileMovementTimeline/FileMovementTimeline'
import RelatedWork from '../RelatedWork/RelatedWork'

type Props = {
  file: {
    fileNumber: string
    subject: string
    status: string
    priority: string
    direction: string
    department: string
    currentHolder: string
    createdDate: string
    lastMovement: string
    referenceNumber: string
    description: string
    relatedDocument: string
    relatedCorrespondence: string
    relatedTask: string
    relatedMeeting: string
    movementHistory: Array<{
      id: string
      date: string
      movement: string
      from: string
      to: string
      person: string
      remarks: string
    }>
  }
  onClose: () => void
  children?: React.ReactNode
}

export default function FileDetail({ file, onClose, children }: Props) {
  return (
    <aside className="registry-detail-panel">
      <div className="registry-detail-header">
        <div>
          <span>FILE DETAIL</span>
          <h3>{file.fileNumber}</h3>
        </div>
        <button type="button" className="ghost-button" onClick={onClose}>Close</button>
      </div>

      <div className="detail-title-row">
        <div>
          <strong>{file.subject}</strong>
        </div>
        <div className="detail-badges">
          <span className={`status-pill ${file.status.toLowerCase().replace(/\s+/g, '-')}`}>{file.status}</span>
          <span className={`priority-pill ${file.priority.toLowerCase()}`}>{file.priority}</span>
        </div>
      </div>

      <div className="detail-body-grid">
        <FileOverview file={file} />
        <FileMovementTimeline events={file.movementHistory} />
      </div>

      <RelatedWork file={file} />
      {children}
    </aside>
  )
}
