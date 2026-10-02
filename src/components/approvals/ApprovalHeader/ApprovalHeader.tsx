import './ApprovalHeader.css'

type Props = {
  onRequestApproval: () => void
}

export default function ApprovalHeader({ onRequestApproval }: Props) {
  return (
    <header className="approval-header">
      <div className="approval-header__copy">
        <span className="approval-eyebrow">WORKFLOW CONTROL</span>
        <h1>Approvals</h1>
        <p>Review requests, make decisions, and keep work moving.</p>
      </div>

      <button type="button" className="primary-button" onClick={onRequestApproval}>
        Request Approval
      </button>
    </header>
  )
}
