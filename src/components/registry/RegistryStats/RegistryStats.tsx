import './RegistryStats.css'

type Props = {
  stats: {
    total: number
    incoming: number
    outgoing: number
    withStaff: number
    overdue: number
  }
}

const statsList = [
  { key: 'total', label: 'Total Files' },
  { key: 'incoming', label: 'Incoming Today' },
  { key: 'outgoing', label: 'Outgoing Today' },
  { key: 'withStaff', label: 'Currently With Staff' },
  { key: 'overdue', label: 'Overdue' },
] as const

export default function RegistryStats({ stats }: Props) {
  return (
    <section className="registry-stats">
      {statsList.map((item) => (
        <div key={item.key} className="registry-stat">
          <span>{item.label}</span>
          <strong>{stats[item.key]}</strong>
        </div>
      ))}
    </section>
  )
}
