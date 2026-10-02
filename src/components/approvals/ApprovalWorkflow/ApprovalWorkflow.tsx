import './ApprovalWorkflow.css'

type Stage = {
  label: string
  date: string
  isCurrent?: boolean
}

type Props = {
  stages: Stage[]
}

export default function ApprovalWorkflow({ stages }: Props) {
  return (
    <div className="approval-workflow" aria-label="Approval workflow">
      {stages.map((stage, index) => (
        <div key={`${stage.label}-${index}`} className={`approval-workflow__step ${stage.isCurrent ? 'current' : ''}`}>
          <span className="approval-workflow__dot" />
          <div className="approval-workflow__content">
            <strong>{stage.label}</strong>
            <small>{stage.date}</small>
          </div>
          {index < stages.length - 1 ? <span className="approval-workflow__line" /> : null}
        </div>
      ))}
    </div>
  )
}
