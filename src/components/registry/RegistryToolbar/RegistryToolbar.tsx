import './RegistryToolbar.css'

type Props = {
  query: string
  onQueryChange: (value: string) => void
  direction: 'All' | 'Incoming' | 'Outgoing'
  department: string
  status: string
  priority: string
  sort: string
  view: 'Table' | 'Cards'
  onDirectionChange: (value: 'All' | 'Incoming' | 'Outgoing') => void
  onDepartmentChange: (value: string) => void
  onStatusChange: (value: string) => void
  onPriorityChange: (value: string) => void
  onSortChange: (value: string) => void
  onViewChange: (value: 'Table' | 'Cards') => void
  onClearFilters: () => void
}

export default function RegistryToolbar({ query, onQueryChange, direction, department, status, priority, sort, view, onDirectionChange, onDepartmentChange, onStatusChange, onPriorityChange, onSortChange, onViewChange, onClearFilters }: Props) {
  return (
    <div className="registry-toolbar">
      <div className="registry-search-wrap">
        <input
          type="search"
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          placeholder="Search by file number, subject, reference, person, or department..."
        />
      </div>

      <div className="registry-filters-grid">
        <label>
          <span>Direction</span>
          <select value={direction} onChange={(event) => onDirectionChange(event.target.value as 'All' | 'Incoming' | 'Outgoing')}>
            <option value="All">All</option>
            <option value="Incoming">Incoming</option>
            <option value="Outgoing">Outgoing</option>
          </select>
        </label>

        <label>
          <span>Department</span>
          <select value={department} onChange={(event) => onDepartmentChange(event.target.value)}>
            <option value="All">All</option>
            <option value="TPC">TPC</option>
            <option value="Registry">Registry</option>
            <option value="HR">HR</option>
            <option value="Administration">Administration</option>
          </select>
        </label>

        <label>
          <span>Status</span>
          <select value={status} onChange={(event) => onStatusChange(event.target.value)}>
            <option value="All">All</option>
            <option value="Registered">Registered</option>
            <option value="Received">Received</option>
            <option value="With Registry">With Registry</option>
            <option value="With Staff">With Staff</option>
            <option value="Under Action">Under Action</option>
            <option value="Returned">Returned</option>
            <option value="Dispatched">Dispatched</option>
            <option value="Closed">Closed</option>
            <option value="Archived">Archived</option>
          </select>
        </label>

        <label>
          <span>Priority</span>
          <select value={priority} onChange={(event) => onPriorityChange(event.target.value)}>
            <option value="All">All</option>
            <option value="Low">Low</option>
            <option value="Normal">Normal</option>
            <option value="High">High</option>
            <option value="Urgent">Urgent</option>
          </select>
        </label>

        <label>
          <span>Sort</span>
          <select value={sort} onChange={(event) => onSortChange(event.target.value)}>
            <option value="latest">Latest</option>
            <option value="file-asc">File Number</option>
            <option value="priority">Priority</option>
            <option value="status">Status</option>
          </select>
        </label>

        <div className="registry-view-controls">
          <span>View</span>
          <div className="view-toggle">
            <button type="button" className={view === 'Table' ? 'view-button active' : 'view-button'} onClick={() => onViewChange('Table')}>Table</button>
            <button type="button" className={view === 'Cards' ? 'view-button active' : 'view-button'} onClick={() => onViewChange('Cards')}>Cards</button>
          </div>
        </div>
      </div>

      <div className="toolbar-actions">
        <button type="button" className="ghost-button" onClick={onClearFilters}>Clear filters</button>
      </div>
    </div>
  )
}
