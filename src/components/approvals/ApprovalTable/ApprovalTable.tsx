import ApprovalRow from '../ApprovalRow/ApprovalRow'
import './ApprovalTable.css'

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
  approvals: Approval[]
  onOpen: (id: string) => void
}

export default function ApprovalTable({ approvals, onOpen }: Props) {
  return (
    <div className="approval-table-wrap">
      <table className="approval-table">
        <thead>
          <tr>
            <th>Request</th>
            <th>Type</th>
            <th>Requested By</th>
            <th>Department</th>
            <th>Priority</th>
            <th>Status</th>
            <th>Submitted</th>
            <th>Due</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {approvals.map((approval) => (
            <ApprovalRow key={approval.id} approval={approval} onOpen={onOpen} />
          ))}
        </tbody>
      </table>
    </div>
  )
}
