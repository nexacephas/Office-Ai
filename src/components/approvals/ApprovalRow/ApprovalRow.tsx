import './ApprovalRow.css'

type Approval = {
  id: string
  title: string
  type: string
  requestedBy: string
  department: string
  priority: 'Urgent' | 'High' | 'Normal' | 'Low'
  status: string
  submitted: string
  due: string
  referenceNumber?: string
}

type Props = {
  approval: Approval
  onOpen: (id: string) => void
}

export default function ApprovalRow({ approval, onOpen }: Props) {
  return (
    <tr className="approval-row" onClick={() => onOpen(approval.id)}>
      <td>
        <div className="approval-row__request">
          <strong>{approval.title}</strong>
          <span>{approval.referenceNumber ?? 'REF-1042'}</span>
        </div>
      </td>
      <td>{approval.type}</td>
      <td>{approval.requestedBy}</td>
      <td>{approval.department}</td>
      <td><span className={`priority-pill ${approval.priority.toLowerCase()}`}>{approval.priority}</span></td>
      <td><span className={`status-pill ${approval.status.toLowerCase().replace(/\s+/g, '-')}`}>{approval.status}</span></td>
      <td>{approval.submitted}</td>
      <td>{approval.due}</td>
      <td>
        <button type="button" className="ghost-button small" onClick={(event) => {
          event.stopPropagation()
          onOpen(approval.id)
        }}>
          Review
        </button>
      </td>
    </tr>
  )
}
