import './FileCard.css'

type FileRecord = {
  id: string
  fileNumber: string
  subject: string
  direction: string
  department: string
  currentHolder: string
  status: string
  lastMovement: string
  priority: string
}

type Props = {
  file: FileRecord
  onOpen: (id: string) => void
  onArchive: (id: string) => void
}

export default function FileCard({ file, onOpen, onArchive }: Props) {
  return (
    <article className="registry-file-card">
      <div className="registry-file-card-header">
        <div>
          <span className="registry-card-number">{file.fileNumber}</span>
          <h4>{file.subject}</h4>
        </div>
        <span className={`status-pill ${file.status.toLowerCase().replace(/\s+/g, '-')}`}>{file.status}</span>
      </div>
      <dl>
        <div><dt>Direction</dt><dd>{file.direction}</dd></div>
        <div><dt>Department</dt><dd>{file.department}</dd></div>
        <div><dt>Holder</dt><dd>{file.currentHolder}</dd></div>
        <div><dt>Last movement</dt><dd>{file.lastMovement}</dd></div>
      </dl>
      <div className="registry-card-actions">
        <button type="button" className="secondary-button" onClick={() => onOpen(file.id)}>Open</button>
        <button type="button" className="ghost-button" onClick={() => onArchive(file.id)}>Archive</button>
      </div>
    </article>
  )
}
