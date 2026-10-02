import './ApprovalDeadline.css'

type Deadline = {
  level: 'Urgent' | 'High' | 'Normal'
  title: string
  due: string
}

type Props = {
  deadlines: Deadline[]
}

export default function ApprovalDeadline({ deadlines }: Props) {
  return (
    <section className="approval-deadlines">
      <div className="approval-section-header">
        <span>APPROVALS NEEDING ATTENTION</span>
        <h3>Time-sensitive items</h3>
      </div>

      <div className="approval-deadline-list">
        {deadlines.map((deadline) => (
          <div key={`${deadline.level}-${deadline.title}`} className="approval-deadline-item">
            <span className={`priority-pill ${deadline.level.toLowerCase()}`}>{deadline.level}</span>
            <strong>{deadline.title}</strong>
            <small>Due {deadline.due}</small>
          </div>
        ))}
      </div>
    </section>
  )
}
