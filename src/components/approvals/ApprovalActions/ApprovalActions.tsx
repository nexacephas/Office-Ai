import './ApprovalActions.css'

type Props = {
  onReview: () => void
  onViewSource: () => void
  onEditDraft: () => void
  onApprove: () => void
}

export default function ApprovalActions({ onReview, onViewSource, onEditDraft, onApprove }: Props) {
  return (
    <div className="approval-actions">
      <button type="button" className="secondary-button" onClick={onReview}>Review AI reasoning</button>
      <button type="button" className="secondary-button" onClick={onViewSource}>View source documents</button>
      <button type="button" className="secondary-button" onClick={onEditDraft}>Edit draft</button>
      <button type="button" className="primary-button" onClick={onApprove}>Approve</button>
    </div>
  )
}
