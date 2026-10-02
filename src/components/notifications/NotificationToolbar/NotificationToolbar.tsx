import type { NotificationPriority, NotificationType } from '../notificationTypes'
import NotificationIcon from '../NotificationIcon'
import './NotificationToolbar.css'

type DateFilter = 'All dates' | 'Today' | 'Yesterday' | 'Last 7 days' | 'Older'
type Props = { search: string; type: NotificationType | 'All'; status: 'All' | 'Read' | 'Unread'; priority: 'All' | NotificationPriority; date: DateFilter; filtersOpen: boolean; hasFilters: boolean; onSearch: (value: string) => void; onType: (value: NotificationType | 'All') => void; onStatus: (value: 'All' | 'Read' | 'Unread') => void; onPriority: (value: 'All' | NotificationPriority) => void; onDate: (value: DateFilter) => void; onToggleFilters: () => void; onClear: () => void }
const types: NotificationType[] = ['Tasks', 'Approvals', 'Correspondence', 'Meetings', 'Documents', 'Files & Registry', 'AI', 'System']

export default function NotificationToolbar({ search, type, status, priority, date, filtersOpen, hasFilters, onSearch, onType, onStatus, onPriority, onDate, onToggleFilters, onClear }: Props) {
  return (
    <div className="notification-toolbar">
      <div className="notification-toolbar-top">
        <label className="notification-search"><NotificationIcon name="search" size={17} /><input type="search" value={search} onChange={(event) => onSearch(event.target.value)} placeholder="Search notifications..." aria-label="Search notifications" /></label>
        <button className="notification-filter-toggle" type="button" aria-expanded={filtersOpen} onClick={onToggleFilters}><NotificationIcon name="filter" size={16} /> Filters</button>
      </div>
      <div className={`notification-filters${filtersOpen ? ' is-open' : ''}`}>
        <label><span>Type</span><select value={type} onChange={(event) => onType(event.target.value as NotificationType | 'All')}><option value="All">All types</option>{types.map((option) => <option key={option}>{option}</option>)}</select></label>
        <label><span>Status</span><select value={status} onChange={(event) => onStatus(event.target.value as 'All' | 'Read' | 'Unread')}><option>All</option><option>Unread</option><option>Read</option></select></label>
        <label><span>Priority</span><select value={priority} onChange={(event) => onPriority(event.target.value as 'All' | NotificationPriority)}><option>All</option><option>Urgent</option><option>High</option><option>Normal</option><option>Low</option></select></label>
        <label><span>Date</span><select value={date} onChange={(event) => onDate(event.target.value as DateFilter)}><option>All dates</option><option>Today</option><option>Yesterday</option><option>Last 7 days</option><option>Older</option></select></label>
        {hasFilters && <button className="notification-clear-filters" type="button" onClick={onClear}>Clear filters</button>}
        <div className="notification-filter-drawer-title"><strong>Filter notifications</strong><button type="button" onClick={onToggleFilters} aria-label="Close filters"><NotificationIcon name="close" size={17} /></button></div>
        <button className="notification-filter-done" type="button" onClick={onToggleFilters}>Done</button>
      </div>
    </div>
  )
}