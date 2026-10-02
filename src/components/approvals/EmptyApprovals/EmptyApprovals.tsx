import './EmptyApprovals.css'

type Props = {
  title: string
  description: string
}

export default function EmptyApprovals({ title, description }: Props) {
  return (
    <div className="approval-empty-state">
      <div className="approval-empty-state__badge">All caught up</div>
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  )
}
