import './FileTable.css'
import FileActions from '../FileActions/FileActions'

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
  files: FileRecord[]
  onOpen: (id: string) => void
  onArchive: (id: string) => void
}

export default function FileTable({ files, onOpen, onArchive }: Props) {
  return (
    <table className="registry-table">
      <thead>
        <tr>
          <th>File Number</th>
          <th>Subject</th>
          <th>Direction</th>
          <th>From / To</th>
          <th>Department</th>
          <th>Current Holder</th>
          <th>Status</th>
          <th>Last Movement</th>
          <th>Priority</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {files.map((file) => (
          <tr key={file.id}>
            <td className="file-number-cell">{file.fileNumber}</td>
            <td>{file.subject}</td>
            <td><span className="direction-pill">{file.direction}</span></td>
            <td>{file.department}</td>
            <td>{file.department}</td>
            <td>{file.currentHolder}</td>
            <td><span className={`status-pill ${file.status.toLowerCase().replace(/\s+/g, '-')}`}>{file.status}</span></td>
            <td>{file.lastMovement}</td>
            <td><span className={`priority-pill ${file.priority.toLowerCase()}`}>{file.priority}</span></td>
            <td>
              <FileActions compact onOpen={() => onOpen(file.id)} onArchive={() => onArchive(file.id)} />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
