import './ApprovalCard.css'

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
}

type Props = {
  approval: Approval
  onOpen: (id: string) => void
}

export default function ApprovalCard({ approval, onOpen }: Props) {
  return (
    <button type="button" className="approval-card" onClick={() => onOpen(approval.id)}>
      <div className="approval-card__top">
        <strong>{approval.title}</strong>
        <span className={`status-pill ${approval.status.toLowerCase().replace(/\s+/g, '-')}`}>{approval.status}</span>
      </div>
      <div className="approval-card__meta">
        <span>{approval.type}</span>
        <span>{approval.requestedBy}</span>
      </div>
      <div className="approval-card__meta">
        <span>{approval.department}</span>
        <span className={`priority-pill ${approval.priority.toLowerCase()}`}>{approval.priority}</span>
      </div>
      <div className="approval-card__meta compact">
        <span>Submitted: {approval.submitted}</span>
        <span>Due: {approval.due}</span>
      </div>
    </button>
  )
}
