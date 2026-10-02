import './FileOverview.css'

type Props = {
  file: {
    fileNumber: string
    subject: string
    direction: string
    department: string
    currentHolder: string
    createdDate: string
    lastMovement: string
    referenceNumber: string
    priority: string
    description: string
  }
}

export default function FileOverview({ file }: Props) {
  return (
    <section className="detail-block">
      <div className="detail-block-header">
        <h4>Overview</h4>
      </div>

      <div className="detail-grid">
        <div><span>File Number</span><strong>{file.fileNumber}</strong></div>
        <div><span>Subject</span><strong>{file.subject}</strong></div>
        <div><span>Direction</span><strong>{file.direction}</strong></div>
        <div><span>Department</span><strong>{file.department}</strong></div>
        <div><span>Current Holder</span><strong>{file.currentHolder}</strong></div>
        <div><span>Created Date</span><strong>{file.createdDate}</strong></div>
        <div><span>Last Movement</span><strong>{file.lastMovement}</strong></div>
        <div><span>Reference</span><strong>{file.referenceNumber}</strong></div>
        <div><span>Priority</span><strong>{file.priority}</strong></div>
      </div>

      <p className="detail-description">{file.description}</p>
    </section>
  )
}
