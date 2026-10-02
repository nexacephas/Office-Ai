import './ApprovalDetail.css'
import ApprovalWorkflow from '../ApprovalWorkflow/ApprovalWorkflow'
import ApprovalComments from '../ApprovalComments/ApprovalComments'
import ApprovalContent from '../ApprovalContent/ApprovalContent'
import ApprovalReviewPanel from '../ApprovalReviewPanel/ApprovalReviewPanel'
import RelatedApprovalWork from '../RelatedApprovalWork/RelatedApprovalWork'
import type { ReactNode } from 'react'

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
  approver: string
  item: string
  reason: string
  content: string
  aiAssisted?: boolean
  workflow: Array<{ label: string; date: string; isCurrent?: boolean }>
  comments: Array<{ time: string; author: string; text: string }>
  relatedWork: Array<{ label: string; to: string; type: string }>
}

type Props = {
  approval: Approval
  onClose: () => void
  onApprove: (comment?: string) => void
  onRequestChanges: (comment: string) => void
  onReject: (comment: string) => void
}

export default function ApprovalDetail({ approval, onClose, onApprove, onRequestChanges, onReject }: Props) {
  const infoRows: Array<{ label: string; value: ReactNode }> = [
    { label: 'Requested by', value: approval.requestedBy },
    { label: 'Department', value: approval.department },
    { label: 'Submitted', value: approval.submitted },
    { label: 'Due date', value: approval.due },
    { label: 'Approval type', value: approval.type },
    { label: 'Approver', value: approval.approver },
  ]

  return (
    <aside className="approval-detail-panel">
      <div className="approval-detail-panel__header">
        <div>
          <span className="approval-detail-panel__eyebrow">APPROVAL DETAIL</span>
          <h3>{approval.title}</h3>
        </div>
        <button type="button" className="ghost-button" onClick={onClose}>Close</button>
      </div>

      <div className="approval-detail-panel__status-row">
        <span className={`status-pill ${approval.status.toLowerCase().replace(/\s+/g, '-')}`}>{approval.status}</span>
        <span className={`priority-pill ${approval.priority.toLowerCase()}`}>{approval.priority}</span>
      </div>

      <div className="approval-detail-panel__body">
        <section className="approval-detail-card">
          <h4>Request information</h4>
          <div className="approval-detail-grid">
            {infoRows.map((row) => (
              <div key={row.label} className="approval-detail-item">
                <span>{row.label}</span>
                <strong>{row.value}</strong>
              </div>
            ))}
          </div>
          <div className="approval-detail-note">
            <span>Reason for approval</span>
            <p>{approval.reason}</p>
          </div>
        </section>

        <section className="approval-detail-card">
          <h4>Item being approved</h4>
          <ApprovalContent approval={approval} />
        </section>

        <section className="approval-detail-card">
          <h4>Workflow</h4>
          <ApprovalWorkflow stages={approval.workflow} />
        </section>

        <section className="approval-detail-card">
          <h4>Review</h4>
          <ApprovalReviewPanel
            approval={approval}
            onApprove={onApprove}
            onRequestChanges={onRequestChanges}
            onReject={onReject}
          />
        </section>

        <section className="approval-detail-card">
          <h4>Comments & activity</h4>
          <ApprovalComments comments={approval.comments} />
        </section>

        <section className="approval-detail-card">
          <h4>Related work</h4>
          <RelatedApprovalWork items={approval.relatedWork} />
        </section>
      </div>
    </aside>
  )
}
