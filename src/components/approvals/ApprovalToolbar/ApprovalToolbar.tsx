import './ApprovalToolbar.css'

type Props = {
  query: string
  typeFilter: string
  statusFilter: string
  priorityFilter: string
  departmentFilter: string
  requesterFilter: string
  approverFilter: string
  dateFilter: string
  sort: string
  onQueryChange: (value: string) => void
  onTypeChange: (value: string) => void
  onStatusChange: (value: string) => void
  onPriorityChange: (value: string) => void
  onDepartmentChange: (value: string) => void
  onRequesterChange: (value: string) => void
  onApproverChange: (value: string) => void
  onDateChange: (value: string) => void
  onSortChange: (value: string) => void
  onClearFilters: () => void
}

export default function ApprovalToolbar({
  query,
  typeFilter,
  statusFilter,
  priorityFilter,
  departmentFilter,
  requesterFilter,
  approverFilter,
  dateFilter,
  sort,
  onQueryChange,
  onTypeChange,
  onStatusChange,
  onPriorityChange,
  onDepartmentChange,
  onRequesterChange,
  onApproverChange,
  onDateChange,
  onSortChange,
  onClearFilters,
}: Props) {
  return (
    <div className="approval-toolbar">
      <label className="approval-search">
        <span className="approval-search__icon">⌕</span>
        <input
          type="search"
          value={query}
          placeholder="Search approvals by title, requester, document, or reference..."
          onChange={(event) => onQueryChange(event.target.value)}
        />
      </label>

      <div className="approval-toolbar__filters">
        <select value={typeFilter} onChange={(event) => onTypeChange(event.target.value)}>
          <option value="All">Type</option>
          <option value="Document">Document</option>
          <option value="Correspondence">Correspondence</option>
          <option value="Meeting">Meeting</option>
          <option value="Task">Task</option>
          <option value="AI Draft">AI Draft</option>
        </select>
        <select value={statusFilter} onChange={(event) => onStatusChange(event.target.value)}>
          <option value="All">Status</option>
          <option value="Pending">Pending</option>
          <option value="In Review">In Review</option>
          <option value="Changes Requested">Changes Requested</option>
          <option value="Approved">Approved</option>
          <option value="Rejected">Rejected</option>
          <option value="Cancelled">Cancelled</option>
          <option value="Expired">Expired</option>
        </select>
        <select value={priorityFilter} onChange={(event) => onPriorityChange(event.target.value)}>
          <option value="All">Priority</option>
          <option value="Urgent">Urgent</option>
          <option value="High">High</option>
          <option value="Normal">Normal</option>
          <option value="Low">Low</option>
        </select>
        <select value={departmentFilter} onChange={(event) => onDepartmentChange(event.target.value)}>
          <option value="All">Department</option>
          <option value="TPC">TPC</option>
          <option value="Transport Planning Unit">Transport Planning Unit</option>
          <option value="Administrative Department">Administrative Department</option>
          <option value="HR">HR</option>
          <option value="Legal">Legal</option>
        </select>
        <select value={requesterFilter} onChange={(event) => onRequesterChange(event.target.value)}>
          <option value="All">Requester</option>
          <option value="Cephas A.">Cephas A.</option>
          <option value="Naomi L.">Naomi L.</option>
          <option value="Miriam K.">Miriam K.</option>
          <option value="Transport Planning Unit">Transport Planning Unit</option>
        </select>
        <select value={approverFilter} onChange={(event) => onApproverChange(event.target.value)}>
          <option value="All">Approver</option>
          <option value="Manager">Manager</option>
          <option value="Director">Director</option>
          <option value="Permanent Secretary">Permanent Secretary</option>
        </select>
        <select value={dateFilter} onChange={(event) => onDateChange(event.target.value)}>
          <option value="All">Date</option>
          <option value="Today">Today</option>
          <option value="Yesterday">Yesterday</option>
          <option value="Last 7 Days">Last 7 Days</option>
        </select>
        <select value={sort} onChange={(event) => onSortChange(event.target.value)}>
          <option value="newest">Newest</option>
          <option value="oldest">Oldest</option>
          <option value="priority">Priority</option>
          <option value="deadline">Deadline</option>
        </select>
      </div>

      <button type="button" className="secondary-button small" onClick={onClearFilters}>Clear filters</button>
    </div>
  )
}
