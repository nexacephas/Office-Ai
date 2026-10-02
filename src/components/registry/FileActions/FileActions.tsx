import './FileActions.css'

type Props = {
  compact?: boolean
  onOpen?: () => void
  onRecordMovement?: () => void
  onAssign?: () => void
  onReminder?: () => void
  onLinkDocument?: () => void
  onCreateTask?: () => void
  onArchive?: () => void
}

export default function FileActions({ compact = false, onOpen, onRecordMovement, onAssign, onReminder, onLinkDocument, onCreateTask, onArchive }: Props) {
  const actions = [
    { label: 'Open', onClick: onOpen },
    { label: 'Record Movement', onClick: onRecordMovement },
    { label: 'Assign', onClick: onAssign },
    { label: 'Send Reminder', onClick: onReminder },
    { label: 'Link Document', onClick: onLinkDocument },
    { label: 'Create Task', onClick: onCreateTask },
    { label: 'Archive', onClick: onArchive, danger: true },
  ]

  if (compact) {
    return (
      <div className="file-actions compact">
        {actions.filter((action) => action.label !== 'Archive').slice(0, 3).map((action) => (
          <button key={action.label} type="button" className="file-action-link" onClick={action.onClick}>{action.label}</button>
        ))}
      </div>
    )
  }

  return (
    <div className="file-actions">
      {actions.map((action) => (
        <button key={action.label} type="button" className={action.danger ? 'file-action danger' : 'file-action'} onClick={action.onClick}>{action.label}</button>
      ))}
    </div>
  )
}
