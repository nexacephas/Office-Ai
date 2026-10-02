import './ApprovalStats.css'

type Stat = {
  label: string
  value: number
  tone?: 'default' | 'warning' | 'success' | 'danger'
}

type Props = {
  stats: Stat[]
}

export default function ApprovalStats({ stats }: Props) {
  return (
    <div className="approval-stats" aria-label="Approval summary">
      {stats.map((stat) => (
        <div key={stat.label} className={`approval-stat ${stat.tone ?? 'default'}`}>
          <span>{stat.label}</span>
          <strong>{stat.value}</strong>
        </div>
      ))}
    </div>
  )
}
