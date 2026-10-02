import { useState } from 'react'
import './ApprovalReviewPanel.css'

type Approval = {
  status: string
}

type Props = {
  approval: Approval
  onApprove: (comment?: string) => void
  onRequestChanges: (comment: string) => void
  onReject: (comment: string) => void
}

export default function ApprovalReviewPanel({ approval, onApprove, onRequestChanges, onReject }: Props) {
  const [comment, setComment] = useState('')
  const [mode, setMode] = useState<'approve' | 'changes' | 'reject'>('approve')

  function handleSubmit() {
    if (mode === 'approve') {
      const confirmed = window.confirm('Approve this request? This confirms your decision without executing the underlying action automatically.')
      if (!confirmed) return
      onApprove(comment.trim() || undefined)
      return
    }

    if (mode === 'changes') {
      if (!comment.trim()) {
        window.alert('Add a comment for the requester before requesting changes.')
        return
      }
      const confirmed = window.confirm('Request changes for this approval?')
      if (!confirmed) return
      onRequestChanges(comment.trim())
      return
    }

    if (!comment.trim()) {
      window.alert('Add a comment before rejecting this approval.')
      return
    }
    const confirmed = window.confirm('Reject this request? This action records the decision and stops progression until the requester updates the item.')
    if (!confirmed) return
    onReject(comment.trim())
  }

  return (
    <div className="approval-review-panel">
      <div className="approval-review-panel__toggle">
        <button type="button" className={mode === 'approve' ? 'approval-review-button active' : 'approval-review-button'} onClick={() => setMode('approve')}>Approve</button>
        <button type="button" className={mode === 'changes' ? 'approval-review-button active' : 'approval-review-button'} onClick={() => setMode('changes')}>Request Changes</button>
        <button type="button" className={mode === 'reject' ? 'approval-review-button danger' : 'approval-review-button danger'} onClick={() => setMode('reject')}>Reject</button>
      </div>

      <label className="approval-review-panel__field">
        <span>{mode === 'approve' ? 'Optional comment' : 'Add a comment for the requester...'}</span>
        <textarea
          value={comment}
          onChange={(event) => setComment(event.target.value)}
          rows={4}
          placeholder={mode === 'approve' ? 'Optional approval note...' : 'Add a comment for the requester...'}
        />
      </label>

      <button type="button" className="primary-button" onClick={handleSubmit} disabled={approval.status === 'Approved' || approval.status === 'Rejected'}>
        {mode === 'approve' ? 'Approve' : mode === 'changes' ? 'Request Changes' : 'Reject'}
      </button>
    </div>
  )
}
