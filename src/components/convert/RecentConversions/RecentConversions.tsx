import './RecentConversions.css'

type Item = {
  file: string
  conversion: string
  status: string
  date: string
  size: string
  outputType: string
}

type Props = {
  items: Item[]
}

export default function RecentConversions({ items }: Props) {
  return (
    <section className="recent-conversions-panel">
      <div className="recent-conversions-header">
        <div>
          <span>RECENT</span>
          <h3>Recent conversions</h3>
        </div>
      </div>

      <div className="recent-conversions-list">
        {items.map((item) => (
          <div key={`${item.file}-${item.conversion}`} className="recent-item">
            <div>
              <strong>{item.file}</strong>
              <small>{item.conversion}</small>
            </div>
            <div className="recent-item-meta">
              <span className={`status-pill ${item.status.toLowerCase()}`}>{item.status}</span>
              <small>{item.outputType}</small>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
