import './OverdueFiles.css'

type Props = {
  files: Array<{
    id: string
    fileNumber: string
    currentHolder: string
    expectedReturnDate: string
    daysOverdue: number
    priority: string
  }>
  onOpen: (id: string) => void
}

export default function OverdueFiles({ files, onOpen }: Props) {
  if (!files.length) {
    return (
      <section className="registry-section-card">
        <div className="section-header">
          <span>OVERDUE FILES</span>
          <h3>No overdue files</h3>
        </div>
        <p className="empty-inline">All tracked files are currently within their expected timelines.</p>
      </section>
    )
  }

  return (
    <section className="registry-section-card">
      <div className="section-header">
        <span>OVERDUE FILES</span>
        <h3>Action required</h3>
      </div>
      <div className="overdue-table">
        <div className="overdue-row header">
          <span>File</span>
          <span>Current Holder</span>
          <span>Expected Return</span>
          <span>Days Overdue</span>
          <span>Priority</span>
          <span>Action</span>
        </div>
        {files.map((file) => (
          <div key={file.id} className="overdue-row">
            <span>{file.fileNumber}</span>
            <span>{file.currentHolder}</span>
            <span>{file.expectedReturnDate}</span>
            <span>{file.daysOverdue}</span>
            <span className={`priority-pill ${file.priority.toLowerCase()}`}>{file.priority}</span>
            <button type="button" className="ghost-button small" onClick={() => onOpen(file.id)}>View File</button>
          </div>
        ))}
      </div>
    </section>
  )
}
