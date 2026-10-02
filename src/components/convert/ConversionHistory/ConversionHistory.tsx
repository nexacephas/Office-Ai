import './ConversionHistory.css'

type HistoryItem = {
  id: string
  file: string
  conversion: string
  status: 'Completed' | 'Processing' | 'Failed'
  date: string
  size: string
  outputType: string
}

type Props = {
  items: HistoryItem[]
  filter: 'All' | 'Completed' | 'Processing' | 'Failed'
  query: string
  onFilterChange: (value: 'All' | 'Completed' | 'Processing' | 'Failed') => void
  onSearchChange: (value: string) => void
}

const filters: Array<'All' | 'Completed' | 'Processing' | 'Failed'> = ['All', 'Completed', 'Processing', 'Failed']

export default function ConversionHistory({ items, filter, query, onFilterChange, onSearchChange }: Props) {
  return (
    <section className="conversion-history-panel">
      <div className="history-panel-header">
        <div>
          <span>HISTORY</span>
          <h3>Conversion history</h3>
        </div>
      </div>

      <div className="history-toolbar">
        <div className="history-filter-row">
          {filters.map((item) => (
            <button
              key={item}
              type="button"
              className={filter === item ? 'filter-chip active' : 'filter-chip'}
              onClick={() => onFilterChange(item)}
            >
              {item}
            </button>
          ))}
        </div>
        <input
          type="search"
          value={query}
          placeholder="Search conversions"
          onChange={(event) => onSearchChange(event.target.value)}
        />
      </div>

      <div className="history-list">
        {items.map((item) => (
          <div key={item.id} className="history-item">
            <div>
              <strong>{item.file}</strong>
              <small>{item.conversion}</small>
            </div>
            <div className="history-meta">
              <span className={`status-pill ${item.status.toLowerCase()}`}>{item.status}</span>
              <small>{item.date}</small>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
