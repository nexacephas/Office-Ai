import { useState } from 'react'
import type { CorrespondenceDateFilter, CorrespondencePriority, CorrespondenceSort, CorrespondenceStatusFilter, CorrespondenceType } from '../correspondenceTypes'
import CorrespondenceIcon from './CorrespondenceIcon'
import './CorrespondenceToolbar.css'

interface CorrespondenceToolbarProps {
  query: string
  onQueryChange: (query: string) => void
  type: CorrespondenceType | 'all'
  onTypeChange: (type: CorrespondenceType | 'all') => void
  status: CorrespondenceStatusFilter
  onStatusChange: (status: CorrespondenceStatusFilter) => void
  department: string
  onDepartmentChange: (department: string) => void
  departments: string[]
  date: CorrespondenceDateFilter
  onDateChange: (date: CorrespondenceDateFilter) => void
  priority: CorrespondencePriority | 'all'
  onPriorityChange: (priority: CorrespondencePriority | 'all') => void
  sort: CorrespondenceSort
  onSortChange: (sort: CorrespondenceSort) => void
  onReset: () => void
}

const statuses: Array<[CorrespondenceStatusFilter, string]> = [
  ['all', 'All statuses'], ['draft', 'Draft'], ['received', 'Received'], ['under-review', 'Under Review'], ['awaiting-response', 'Awaiting Response'], ['response-drafted', 'Response Drafted'], ['sent', 'Sent'], ['completed', 'Completed'], ['archived', 'Archived'], ['overdue', 'Overdue'],
]

function FilterFields(props: CorrespondenceToolbarProps) {
  return <>
    <label className="correspondence-select"><span>Type</span><select value={props.type} onChange={(event) => props.onTypeChange(event.target.value as CorrespondenceType | 'all')} aria-label="Filter correspondence type"><option value="all">All types</option><option value="incoming">Incoming</option><option value="outgoing">Outgoing</option></select><CorrespondenceIcon name="chevron" size={13} /></label>
    <label className="correspondence-select"><span>Status</span><select value={props.status} onChange={(event) => props.onStatusChange(event.target.value as CorrespondenceStatusFilter)} aria-label="Filter correspondence status">{statuses.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select><CorrespondenceIcon name="chevron" size={13} /></label>
    <label className="correspondence-select"><span>Department</span><select value={props.department} onChange={(event) => props.onDepartmentChange(event.target.value)} aria-label="Filter by department"><option>All departments</option>{props.departments.map((department) => <option key={department}>{department}</option>)}</select><CorrespondenceIcon name="chevron" size={13} /></label>
    <label className="correspondence-select"><span>Date</span><select value={props.date} onChange={(event) => props.onDateChange(event.target.value as CorrespondenceDateFilter)} aria-label="Filter by date"><option value="any">Any time</option><option value="week">Past 7 days</option><option value="month">Past 30 days</option></select><CorrespondenceIcon name="chevron" size={13} /></label>
    <label className="correspondence-select"><span>Priority</span><select value={props.priority} onChange={(event) => props.onPriorityChange(event.target.value as CorrespondencePriority | 'all')} aria-label="Filter by priority"><option value="all">All priorities</option><option value="low">Low</option><option value="normal">Normal</option><option value="high">High</option><option value="urgent">Urgent</option></select><CorrespondenceIcon name="chevron" size={13} /></label>
    <label className="correspondence-sort"><CorrespondenceIcon name="sort" size={15} /><span className="sr-only">Sort correspondence</span><select value={props.sort} onChange={(event) => props.onSortChange(event.target.value as CorrespondenceSort)} aria-label="Sort correspondence"><option value="newest">Newest</option><option value="oldest">Oldest</option><option value="priority">Priority</option><option value="deadline">Response deadline</option></select><CorrespondenceIcon name="chevron" size={13} /></label>
  </>
}

export default function CorrespondenceToolbar(props: CorrespondenceToolbarProps) {
  const [sheetOpen, setSheetOpen] = useState(false)
  const filterCount = Number(props.type !== 'all') + Number(props.status !== 'all') + Number(props.department !== 'All departments') + Number(props.date !== 'any') + Number(props.priority !== 'all')
  return (
    <section className="correspondence-toolbar" aria-label="Search and filter correspondence">
      <label className="correspondence-search"><CorrespondenceIcon name="search" size={18} /><input type="search" value={props.query} onChange={(event) => props.onQueryChange(event.target.value)} placeholder="Search by subject, reference number, sender, recipient..." aria-label="Search correspondence" />{props.query && <button type="button" aria-label="Clear search" onClick={() => props.onQueryChange('')}><CorrespondenceIcon name="close" size={15} /></button>}</label>
      <div className="correspondence-filter-controls"><FilterFields {...props} />{(filterCount > 0 || props.query) && <button type="button" className="correspondence-reset-filter" onClick={props.onReset}>Reset</button>}</div>
      <div className="correspondence-mobile-filter-row"><button type="button" className="correspondence-mobile-filter-button" aria-expanded={sheetOpen} onClick={() => setSheetOpen(true)}><CorrespondenceIcon name="filter" size={16} />Filters{filterCount > 0 && <span>{filterCount}</span>}</button><label className="correspondence-sort correspondence-mobile-sort"><CorrespondenceIcon name="sort" size={15} /><select value={props.sort} onChange={(event) => props.onSortChange(event.target.value as CorrespondenceSort)} aria-label="Sort correspondence"><option value="newest">Newest</option><option value="oldest">Oldest</option><option value="priority">Priority</option><option value="deadline">Response deadline</option></select><CorrespondenceIcon name="chevron" size={13} /></label>{filterCount > 0 && <button type="button" className="correspondence-reset-filter" onClick={props.onReset}>Reset</button>}</div>
      {sheetOpen && <div className="correspondence-filter-sheet-layer"><button type="button" className="correspondence-filter-backdrop" aria-label="Close filters" onClick={() => setSheetOpen(false)} /><section className="correspondence-filter-sheet" role="dialog" aria-modal="true" aria-labelledby="correspondence-filter-title"><header><div><span className="correspondence-eyebrow">REFINE VIEW</span><h2 id="correspondence-filter-title">Filters</h2></div><button type="button" className="correspondence-icon-button" aria-label="Close filters" onClick={() => setSheetOpen(false)}><CorrespondenceIcon name="close" /></button></header><div className="correspondence-filter-sheet-fields"><FilterFields {...props} /></div><footer><button type="button" className="correspondence-reset-filter" onClick={props.onReset}>Reset all</button><button type="button" className="correspondence-primary-button" onClick={() => setSheetOpen(false)}>Show results</button></footer></section></div>}
    </section>
  )
}